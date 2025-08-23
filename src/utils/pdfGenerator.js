import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function generateAlarmPdf(alarmList, userName = 'Dashboard User') {
  debugger
  if (!alarmList || alarmList.length === 0) {
    alert("Data is not available.");
    return;
  }

  const dataWithIndex = alarmList.map((alarm, index) => ({

    
    wmsEquipmentAlarmHistoryId: index + 1,
    equipmentName: alarm.equipmentName,
    equipmentAlarmName: alarm.equipmentAlarmName,
    equipmentAlarmDesc: alarm.equipmentAlarmDesc,
    equipmentAlarmOccurredDatetime: alarm.alarmOccurredDatetime,
    equipmentAlarmResolvedDatetime: alarm.alarmResolvedDatetime,
  }));

  const tableData = dataWithIndex.map(obj => Object.values(obj));

  const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1000, 700], floatPrecision: 2 });

  // Title
  doc.setFontSize(22);
  doc.text('EQUIPMENT ALARM DETAILS REPORT', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  // User Info
  doc.setFontSize(12);
  doc.text(`User: ${userName}`, 10, 30);

  // Table Headers
  const headers = [['Sr.No', 'Equipment Name', 'Alarm Name', 'Alarm Description', 'Alarm Occurred Date Time', 'Alarm Resolved Date Time']];

  autoTable(doc, {
    head: headers,
    body: tableData,
    startY: 50,
    theme: 'grid',
    headStyles: {
      fillColor: [68, 114, 196],
      textColor: [255, 255, 255],
      fontSize: 12,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 10,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 150 },
      2: { cellWidth: 150 },
      3: { cellWidth: 300 },
      4: { cellWidth: 150 },
      5: { cellWidth: 150 },
    },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.text('This is a system-generated PDF document.', doc.internal.pageSize.getWidth() / 2, pageHeight - 20, { align: 'center' });

  // File Name
  const now = new Date();
  const fileName = `AlarmReport_${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}.pdf`;

  doc.save(fileName);
}
