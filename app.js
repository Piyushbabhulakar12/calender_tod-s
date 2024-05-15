document.addEventListener("DOMContentLoaded", function () {
  let todos = [];

  fetch("http://localhost/New%20Project/get_todos.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((todosData) => {
      todos = todosData;

      var calendarEl = document.getElementById("calendar");
      var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        events: todos.map((data) => ({
          title: data.title,
          start: data.start_date,
          end: data.end_date,
        })),
      });

      calendar.render();
    })
    .catch((error) => {
      console.error("Error fetching todos:", error);
    });
  renderTodoCards();
});

function renderTodoCards(todosData) {
  $("#todoList").empty();

  todosData.forEach((todo) => {
    let subChecklistItemsHtml = "";
    if (todo.sub_checklist_items.length > 0) {
      subChecklistItemsHtml = todo.sub_checklist_items
        .map((item) => {
          return `<div class="p-1">${item.item}</div>`;
        })
        .join("");
    }

    const cardHtml = `
      <div class="col-md-12">
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex gap-2 align-items-center">
              <h5 class="card-title">${
                todo.priority === "Low"
                  ? `<div class="bg-primary shadow" style="border-radius: 5px; padding: 13px"></div>`
                  : todo.priority === "Medium"
                  ? `<div class="bg-warning shadow" style="border-radius: 5px; padding: 13px"></div>`
                  : todo.priority === "High"
                  ? `<div class="bg-danger shadow" style="border-radius: 5px; padding: 13px"></div>`
                  : ""
              } </h5>
              <h4 class="card-title"> <span class="badge" style=" background-color:#000; font-weight: 500; border-radius: 50px ">${
                todo.title
              }</span> </h5>
            </div>
            <div>
              <hr />
            </div>
            <div>
              ${subChecklistItemsHtml}
            </div>
          </div>
        </div>
      </div>`;
    $("#todoList").append(cardHtml);
  });
}

$(document).ready(function () {
  fetch("http://localhost/New%20Project/get_todos.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((todosData) => {
      console.log(todosData);
      renderTodoCards(todosData);
    })
    .catch((error) => {
      console.error("Error fetching todos:", error);
    });
});

function addSubChecklistField() {
  const subChecklistField = `
    <div class="input-group mb-3">
      <input type="text" class="form-control subChecklistItem" placeholder="Sub-checklist item">
      <button class="btn btn-outline-secondary remove-sub-checklist" type="button">Remove</button>
    </div>`;
  $("#subChecklistContainer").append(subChecklistField);
}

$("#subChecklistContainer").on("click", ".remove-sub-checklist", function () {
  $(this).closest(".input-group").remove();
});

$("#addSubChecklistBtn").click(function () {
  addSubChecklistField();
});

$(document).ready(function () {
  $("#addTodoBtn").click(function (e) {
    e.preventDefault();

    var formData = {
      todoTitle: $("#todoTitle").val(),
      todoStartDate: $("#todoStartDate").val(),
      todoEndDate: $("#todoEndDate").val(),
      todoDescription: $("#todoDescription").val(),
      todoStatus: $("#todoStatus").val(),
      todoPriority: $("#todoPriority").val(),
      todoCategory: $("#todoCategory").val(),
      todoComment: $("#todoComment").val(),
      todoColor: $("#todoColor").val(),
      subChecklist: [],
    };

    $(".subChecklistItem").each(function () {
      var subChecklistItem = $(this).val();
      formData.subChecklist.push(subChecklistItem);
    });

    $.ajax({
      type: "POST",
      url: "http://localhost/New%20Project/submit_todo.php",
      data: formData,
      success: function (response) {
        alert(response);
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
        alert("Error occurred. Please try again.");
      },
    });
  });
});

$(document).ready(function () {
  $("#addHolidatLeaveBtn").click(function (e) {
    e.preventDefault();

    var formData = {
      holidayName: $("#holidayName").val(),
      startDate: $("#startDate").val(),
      endDate: $("#endDate").val(),
      leaveType: $("#leaveType").val(),
    };

    $.ajax({
      type: "POST",
      url: "http://localhost/New%20Project/submit_leave.php",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) {
        alert("Leave added successfully!");
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
        alert("Error occurred. Please try again.");
      },
    });
  });
});
