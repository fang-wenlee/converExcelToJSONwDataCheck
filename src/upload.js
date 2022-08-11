import * as xlsx from "xlsx";
import React, { useState } from "react";

const columnHeaders = [
  "Host Name *",
  "IP Address *",
  "IP Netmask *",
  "IP Gateway *",
  "Optional Attributes",
  "Data Center *",
  "KDC/LDAP Base OU *",
  "KDC/LDAP Host Credentials *",
  "KDC/LDAP Realm *",
  "KDC/LDAP ADM Server *",
  "KDC/LDAP OU Alias *"
];

const adcColumnHeaders = [
  "Host Name *",
  "IP Address *",
  "IP Netmask *",
  "IP Gateway *",
  "Optional Attributes",
  "Data Center *"
];

const UploadJson = () => {
  const [serverType, setServerType] = useState("KDCLDAP");
  const [importedType, setImportedType] = useState("");

  const uploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      let file = e.target.files[0].name;
      let allowedExtensions = ["xlsx", "xls"];
      let ext = file.substr(file.lastIndexOf(".") + 1).toLowerCase();

      if (allowedExtensions.indexOf(ext) === -1) {
        console.log("File format is not correct");
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const sheet1 = e.target.result;
          const workbook = xlsx.read(sheet1, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          //  console.log(" sheetName: ", sheetName);
          const worksheet = workbook.Sheets[sheetName];
          const records = xlsx.utils.sheet_to_json(worksheet);

          //=================================
          // for (let val of Object.values(records)) //fang-wen, 40
          // for (let k in records) console.log("key:", k); //0,1

          //==============================
          // console.log("Before : ", records);
          records.map((r) => {
            r["Host Name *"] = r["Host Name *"].trim();
            let columValidation = checkColumExist(r);
          });
          // console.log("Total rows: ", records.length);
          //=====================================
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    }
  };

  const validation = (val) => {
    const hostName = val;
    console.log(hostName);
  };

  const equals = (a, b) =>
    a.length === b.length && a.every((v, i) => v === b[i].trim());

  const checkColumExist = (val) => {
    console.log("Inside CheckCoulum method: ", val);
    let selectedHeader =
      serverType === "KDCLDAP" ? columnHeaders : adcColumnHeaders;

    console.log("Selected Header: ", selectedHeader);
    let fileHeader = Object.keys(val);
    console.log(fileHeader);
    console.log("Extract File Header length:", fileHeader.length);
    console.log("selected Header length:", selectedHeader.length);

    // let equals = selectedHeader.map(
    //   (i) =>
    //     fileHeader.includes(i) &&
    //     selectedHeader.length === fileHeader.length
    // );
    // console.log("is it valid: ", equals);
    // make sure  column of upload file match number of column in the predefined array
    // and has same order as selectedHeader [predefine array]
    let validType = equals(selectedHeader, fileHeader);
    //console.log("are they equal:", validType);

    let cellIndex = [];
    let validRecords = [];
    let hostIsValid = false;

    let importedType = selectedHeader.length === 6 ? "AD" : "KDCLDAP";
    setImportedType(importedType);
    //**** */
    if (validType) {
      //has match coloum
      //checking data in the coloum; 1: hostName 2: IP address 3: optional attribute
      //1st
      console.log(" Obj: ", val);

      for (let v of Object.values(val)) {
        console.log(v);
      }

      // val.map((col, index) => {
      //   console.log("a row", col);
      //   // let checkColumn = record.filter((x) => !!x);

      //   // let checkColumn = Object.keys(record).forEach(
      //   //   (k) => record[k] == null && delete record[k]
      //   // );

      //   if (checkColumn.length !== record.length) {
      //     cellIndex.push(index + 1);
      //     validType = true;
      //     console.log("missing data in the col");
      //   } else {
      //     try {
      //       if (record.length) {
      //         validRecords.push(record);
      //         //host and Ip validation
      //         let hostValidation = validation(record["Host Name *"]);
      //         console.log(hostValidation);
      //       }
      //     } catch (e) {
      //       console.log(e);
      //       hostIsValid = "column Data mismatching";
      //     } //catch
      //   } //else
      // });
      //  }
    }
  };
  return (
    <form>
      <label htmlFor="upload">Upload File</label>
      <input type="file" name="upload" id="upload" onChange={uploadFile} />
    </form>
  );
};

export default UploadJson;
