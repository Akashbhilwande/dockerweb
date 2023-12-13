const form = document.getElementById("data-form");
const resultsDiv = document.getElementById("results");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const prn = document.getElementById("prn").value;
  const name = document.getElementById("name").value;

  try {
    const response = await fetch("/api/insert", {
      method: "POST",
      body: JSON.stringify({ prn, name }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.success) {
      displayResults();
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

async function displayResults() {
  try {
    const response = await fetch("/api/select");
    const data = await response.json();

    if (data.length > 0) {
      resultsDiv.innerHTML = "";
      data.forEach((record) => {
        resultsDiv.innerHTML += `PRN: ${record.prn} Name: ${record.name}<br>`;
      });
    } else {
      resultsDiv.innerHTML = "0 results";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

displayResults();