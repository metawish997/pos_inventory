const Role = require('../models/Role');
const Permission = require('../models/Permission');

const mapMethodToAction = (method) => {
    switch (method.toLowerCase()) {
        case 'get': return 'read';
        case 'post': return 'write';
        case 'put':
        case 'patch': return 'update';
        case 'delete': return 'delete';
        default: return null;
    }
};

const getEndpoints = (app) => {
    const endpoints = [];

    const split = (thing) => {
        if (typeof thing === 'string') {
            return thing.split('/');
        } else if (thing.fast_slash) {
            return '';
        } else {
            const match = thing.toString()
                .replace('\\/?', '')
                .replace('(?=\\/|$)', '$')
                .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
            return match
                ? match[1].replace(/\\(.)/g, '$1').split('/')
                : '<complex>'; // fallback for complex regexes
        }
    };

    const print = (path, layer) => {
        if (layer.route) {
            layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
        } else if (layer.name === 'router' && layer.handle.stack) {
            layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
        } else if (layer.method) {
            const endpointPath = '/' + path.filter(Boolean).join('/');
            endpoints.push({ path: endpointPath, method: layer.method });
        }
    };

    if (app._router && app._router.stack) {
        app._router.stack.forEach(print.bind(null, []));
    }
    
    const unique = [];
    endpoints.forEach(ep => {
        const p = ep.path.replace(/\/{2,}/g, '/'); // remove double slashes
        if (!unique.find(u => u.path === p && u.method === ep.method)) {
            unique.push({ path: p, method: ep.method });
        }
    });
    
    return unique;
};

const seedRBAC = async (app) => {
    if (!app) {
        console.error('Express app instance required for dynamic RBAC seeding.');
        return;
    }

    try {
        console.log('Seeding dynamic RBAC from routes...');
        
        const endpoints = getEndpoints(app);
        const createdPermissions = [];
        
        for (const ep of endpoints) {
            const action = mapMethodToAction(ep.method);
            if (!action) continue;
            
            // Format path to module name: /api/auth/register -> api_auth_register
            const formattedPath = ep.path.replace(/^\/+/, '').replace(/\/+/g, '_').replace(/[:\-]/g, '');
            if (!formattedPath) continue; // Skip root or empty paths

            const permissionName = `${action}_${formattedPath}`;
            
            let permission = await Permission.findOne({ name: permissionName });
            if (!permission) {
                permission = await Permission.create({
                    name: permissionName,
                    module: formattedPath,
                    description: `Can ${action} on ${ep.path}`
                });
            }
            createdPermissions.push(permission._id);
        }
        
        console.log(`Seeded ${createdPermissions.length} permissions dynamically.`);

        let superAdminRole = await Role.findOne({ name: 'super_admin' });
        if (!superAdminRole) {
            superAdminRole = await Role.create({
                name: 'super_admin',
                description: 'Super Administrator with all permissions',
                permissions: createdPermissions
            });
            console.log('Super Admin role created.');
        } else {
            // Merge existing permissions with newly discovered ones to avoid losing manually added ones
            const currentPerms = superAdminRole.permissions.map(p => p.toString());
            const newPerms = createdPermissions.map(p => p.toString());
            const merged = [...new Set([...currentPerms, ...newPerms])];
            
            superAdminRole.permissions = merged;
            await superAdminRole.save();
            console.log('Super Admin role updated with permissions.');
        }

        let userRole = await Role.findOne({ name: 'user' });
        if (!userRole) {
            await Role.create({
                name: 'user',
                description: 'Default User Role',
                permissions: [] 
            });
            console.log('User role created.');
        }

        console.log('Dynamic RBAC Seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding RBAC:', error);
    }
};

module.exports = seedRBAC;
