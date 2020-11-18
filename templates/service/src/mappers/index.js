const mapTenantId = (req, res, next) => {
  res.locals.mappedBody = { ...req.body, tenantId: res.locals.tenantId };
  next();
};

exports.mapTenantId = mapTenantId;
