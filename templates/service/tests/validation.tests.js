const test = require('ava');
const { validateInput } = require('@imoverse/validation');
const { validateAdd{{primaryResourceSingularUcFirst}} } = require('../src/{{primaryResourcePlural}}/validation');

test('Should return valid false and errors when invalid', t => {
  const { valid, errors } = validateAdd{{primaryResourceSingularUcFirst}}({}, { locals: { mappedBody: {} } });

  t.false(valid);
  t.deepEqual(errors, ['{{primaryResourceSingular}} name missing', 'Tenant id missing']);
});

const validCat = {
  name: 'Familiebil',
  tenantId: '2',
  created: 'right now',
};

test('Should be valid', t => {
  const { valid, errors } = validateAdd{{primaryResourceSingularUcFirst}}({}, { locals: { mappedBody: validCat } });

  t.true(valid);
  t.is(errors.length, 0);
});

test('Should go next on valid req body', t => {
  validateInput(
    validateAdd{{primaryResourceSingularUcFirst}},
    { body: validCat},
    { locals: { tenantId: '2' } },
    () => {
      t.pass();
    },
  );
});

test('Should return bad request when validation errors', t => {
  const FakeRes = function (assertFn) {
    let resStatus = 0;

    this.locals = {
      mappedBody: {},
    };

    this.status = function (status) {
      resStatus = status;
      return this;
    };

    this.send = data => {
      assertFn(resStatus, data);
    };
  };

  validateInput(
    validateAdd{{primaryResourceSingularUcFirst}},
    {},
    new FakeRes(
      (resStatus, _) => {
        t.is(resStatus, 400);
      },
    ),
    t.fail,
  );
});
