import pool from "../db";

export const getArgs = async (req, res, list) => {
  let result = {};
  try {
    for (const argType of list) {
      const { name, field, filter, failedMsg } = argType;
      result[name] = filter ? await filter(req[field][name]) : req[field][name];
      if (result[name] === null || result[name] === undefined) {
        const defaultMsg = `Unvalid arguments {${field}.${name} : ${req[field][name]}}`;
        const msg = failedMsg ? `${defaultMsg} : ${failedMsg}` : defaultMsg;
        res.status(400).json({ msg: msg });
        return null;
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
  return result;
};

export const ARGUMENTS = {
  
};
