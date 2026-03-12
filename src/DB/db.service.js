export const create = async ({ model, data = {} } = {}) => {
  return await model.create(data);
};

export const findOne = async ({ model, filter = {}, options = {} } = {}) => {
  const query = model.findOne(filter);

  if (options.populate) {
    query.populate(options.populate);
  }
  if (options.skip) {
    query.skip(options.skip);
  }
  if (options.limit) {
    query.limit(options.limit);
  }

  return await query.exec();
};

export const find = async ({ model, filter = {}, options = {} } = {}) => {
  const query = model.find(filter);

  if (options.populate) {
    query.populate(options.populate);
  }
  if (options.skip) {
    query.skip(options.skip);
  }
  if (options.limit) {
    query.limit(options.limit);
  }

  return await query.exec();
};

export const updateOne = async ({
  model,
  filter = {},
  update = {},
  options = {},
} = {}) => {
  const query = model.updateOne(filter, update, {
    runValidators: true,
    ...options,
  });

  return await query.exec();
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  update = {},
  options = {},
} = {}) => {
  const query = model.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
    ...options,
  });

  return await query.exec();
};

export const deleteOne = async ({ model, filter = {} } = {}) => {
  return await model.deleteOne(filter);
}

export const deleteMany = async ({ model, filter = {} } = {}) => {
  return await model.deleteMany(filter);
}
