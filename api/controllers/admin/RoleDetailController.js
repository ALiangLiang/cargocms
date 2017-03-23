var RoleNames = ["READ_WRITE", "READ", "CREATE", "UPDATE", "DELETE"];

module.exports = {
  index: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index',
      name: RoleNames,
      roleid: await Role.findAll(),
      menuItems: await MenuItem.findAllWithSubMenu(),
      permissions,
    });
  },
  create: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      layout: 'admin/default/create',
      name: RoleNames,
      roleid: await Role.findAll(),
      menuItems: await MenuItem.findAllWithSubMenu(),
      permissions,
    });
  },
  edit: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      layout: 'admin/default/edit',
      name: RoleNames,
      roleid: await Role.findAll(),
      menuItems: await MenuItem.findAllWithSubMenu(),
      permissions,
    });

  },
  show: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      layout: 'admin/default/show',
      name: RoleNames,
      roleid: await Role.findAll(),
      menuItems: await MenuItem.findAllWithSubMenu(),
      permissions,
    });
  },
}
