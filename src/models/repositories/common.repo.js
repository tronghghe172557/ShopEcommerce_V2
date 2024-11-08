const { getUnSelectData, getSelectData } = require("../../utils");

const findAllDocumentUnSelect = async ({
  limit = 50,
  page = 1,
  filter = {},
  unSelect = [],
  sort = "ctime",
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect))
    .lean();

  return documents;
};

const findAllDocumentSelect = async ({
  limit = 50,
  page = 1,
  filter = {},
  select = [],
  sort = "ctime",
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return documents;
};

module.exports = {
    findAllDocumentUnSelect,
    findAllDocumentSelect,
};
