let data = [];

document.getElementById("dataForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const record = {
    teacherName: document.getElementById("teacherName").value.trim(),
    reason: document.getElementById("reason").value,
    datetime: new Date().toLocaleString("ar-EG"),
    solved: document.getElementById("solved").value,
    satisfaction: document.getElementById("satisfaction").value, // رقم بدون %
    notes: document.getElementById("notes").value.trim() || "لايوجد"
  };

  data.push(record);
  saveData();
  renderTable();
  this.reset();
});

function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  data.forEach((item, index) => {
    const row = `
      <tr>
        <td>${item.teacherName}</td>
        <td>${item.reason}</td>
        <td>${item.datetime}</td>
        <td>${item.solved}</td>
        <td>${item.satisfaction} %</td>
        <td>${item.notes}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteRow(${index})">حذف</button></td>
      </tr>`;
    tbody.innerHTML += row;
  });
}

function deleteRow(index) {
  if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
    data.splice(index, 1);
    saveData();
    renderTable();
  }
}

function saveData() {
  localStorage.setItem("contactData", JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem("contactData");
  if (saved) {
    data = JSON.parse(saved);
    renderTable();
  }
}

function exportToExcel() {
  if (data.length === 0) return alert("لا توجد بيانات للتصدير.");

  if (typeof XLSX === 'undefined') {
    return alert("مكتبة SheetJS غير محملة، الرجاء التأكد من تضمينها.");
  }

  try {
    const wsData = [["اسم الأستاذ", "سبب التواصل", "التاريخ والوقت", "تم حل المشكلة", "نسبة الرضى", "ملاحظات"]];
    data.forEach(d => {
      wsData.push([d.teacherName, d.reason, d.datetime, d.solved, d.satisfaction + " %", d.notes]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "MiRMAZ Data");
    XLSX.writeFile(wb, "MiRMAZ_Data.xlsx");
  } catch (error) {
    console.error("خطأ أثناء التصدير:", error);
    alert("حدث خطأ أثناء التصدير، يرجى مراجعة الكونسول.");
  }
}

function printTable() {
  window.print();
}

window.onload = loadData;
