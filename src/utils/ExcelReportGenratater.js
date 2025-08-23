// utils/excelReport.js
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function generateExcelReport(equipmentAlarmHistoryDetailsList = []) {
  if (!equipmentAlarmHistoryDetailsList || equipmentAlarmHistoryDetailsList.length === 0) {
    alert("No data available to generate report.");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Alarm Details Report");

  const title = "Alarm Details Report " + new Date().toLocaleString();

  // Title Row
  const titleRow = worksheet.addRow([title]);
  titleRow.font = { name: "Calibri", size: 22, bold: true };
  worksheet.mergeCells(`A1:G1`);
  worksheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };

  // Blank Row
  worksheet.addRow([]);

  // Header Row
  const header = [
    "Sr. No.",
    "Equipment Name",
    "Alarm Name",
    "Alarm Description",
    "Alarm Occurred Date Time",
    "Alarm Resolved Date Time",
  ];

 

  const headerRow = worksheet.addRow(header);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4472C4" }, // Blue background
    };
    cell.font = { color: { argb: "FFFFFF" }, bold: true }; // White bold text
    cell.alignment = { horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Data Rows
  equipmentAlarmHistoryDetailsList.forEach((mission, index) => {
    worksheet.addRow([
      index + 1,
      mission.equipmentName,
      mission.equipmentAlarmName,
     mission.equipmentAlarmDesc,
      mission.alarmOccurredDatetime,,
      mission.alarmResolvedDatetime,
    ]);
  });

     
  // Set column widths
  const columnWidths = [10, 25, 30, 20, 40, 25, 25];
  columnWidths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  // Footer Row
  const footerRow = worksheet.addRow(["This is a system-generated report."]);
  footerRow.getCell(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFCCFFE5" }, // light pink background
  };
  worksheet.mergeCells(`A${footerRow.number}:G${footerRow.number}`);
  footerRow.alignment = { horizontal: "center" };

  // Generate Excel File
  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `AlarmDetails_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.xlsx`;
  saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fileName);
}
