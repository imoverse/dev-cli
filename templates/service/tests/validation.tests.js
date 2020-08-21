const test = require('ava');
const { validateInput, validateAddCategory } = require('../src/validation');

test('Should return valid false and errors when invalid', t => {
  const { valid, errors } = validateAddCategory({}, { locals: { mappedBody: {} } });

  t.false(valid);
  t.deepEqual(errors, ['Category id missing', 'Category name missing', 'Tenant id missing']);
});

const validCat = {
  id: '1',
  name: 'Familiebil',
  tenantId: '2',
  created: 'right now',
};

test('Should be valid', t => {
  const { valid, errors } = validateAddCategory({}, { locals: { mappedBody: validCat } });

  t.true(valid);
  t.is(errors.length, 0);
});

test('Should go next on valid req body', t => {
  validateInput(
    validateAddCategory,
    {},
    { locals: { mappedBody: validCat } },
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
    validateAddCategory,
    {},
    new FakeRes(
      (resStatus, _) => {
        t.is(resStatus, 400);
      },
    ),
    t.fail,
  );
});
