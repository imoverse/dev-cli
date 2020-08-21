const getTenantId = (req, res, next) => {
  res.locals.tenantId = '69ddd3f5-6042-4447-9e0f-85f716acda00';
  next();
};

const mapTenantId = (req, res, next) => {
  res.locals.mappedBody = { ...req.body, tenantId: res.locals.tenantId };
  next();
};

// TODO: Will come from token later
exports.getTenantId = getTenantId;
exports.mapTenantId = mapTenantId;
exports.mapBodyWithTenantId = [getTenantId, mapTenantId];
