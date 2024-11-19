// document.getElementById("spending").addEventListener("change", function () {
//     const spendingDetails = document.getElementById("spendingDetails");
//     if (this.value === "yes") {
//       spendingDetails.style.display = "block";
//     } else {
//       spendingDetails.style.display = "none";
//     }
//   });
  
//   document.getElementById("questionnaireForm").addEventListener("submit", async function (e) {
//     e.preventDefault();
  
//     const university = document.getElementById("university").value;
//     const background = document.getElementById("background").value;
//     const spending = document.getElementById("spending").value;
//     const income = document.getElementById("income").value || "unknown";
//     const expenses = document.getElementById("expenses").value || "unknown";
  
//     const response = await fetch("/api/generate-budget", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ university, background, spending, income, expenses }),
//     });
  
//     const data = await response.json();
//     document.getElementById("budgetOutput").style.display = "block";
//     document.getElementById("budgetDetails").innerText = data.budget;
//   });


document.getElementById("spending").addEventListener("change", function () {
  const spendingDetails = document.getElementById("spendingDetails");
  spendingDetails.style.display = this.value === "yes" ? "block" : "none";
});

document.getElementById("questionnaireForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent the default page refresh

  const university = document.getElementById("university").value;
  const background = document.getElementById("background").value;
  const spending = document.getElementById("spending").value;
  const income = document.getElementById("income").value || "unknown";
  const expenses = document.getElementById("expenses").value || "unknown";

  try {
    const response = await fetch("/api/generate-budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ university, background, spending, income, expenses }),
    });

    const data = await response.json();
    document.getElementById("budgetOutput").style.display = "block";
    document.getElementById("budgetDetails").innerText = data.budget;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("budgetDetails").innerText =
      "There was an error generating your budget.";
  }
});
