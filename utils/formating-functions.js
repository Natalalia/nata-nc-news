const newFormatDate = function(information) {
  return information.map(element => {
    element["created_at"] = new Date(element["created_at"]);
    return element;
  });
};

const changeKey = function(list, keyToChange, newKey) {
  const newList = [...list];
  newList.forEach(function(item) {
    item[newKey] = item[keyToChange];
    delete item[keyToChange];
  });
  return newList;
};

const createObjectRef = function(list, key1, key2) {
  const newList = [...list];
  return newList.reduce((reference, currentValue) => {
    reference[currentValue[key1]] = currentValue[key2];
    return reference;
  }, {});
};

const formatData = function(list, lookUp, newKey, ref) {
  const newList = [...list];
  newList.forEach(function(item) {
    item[newKey] = lookUp[item[ref]];
    delete item[ref];
  });
  return newList;
};

module.exports = { newFormatDate, changeKey, createObjectRef, formatData };
