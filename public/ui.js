function calculateBtn() {
  let resultsInput = document.getElementById("results");
  let invertedInput = document.getElementById("inverted");

  const arrayFields = getFields();

  const config = {
    results: numberCommaString(resultsInput.value),
    invert: numberCommaString(invertedInput.value),
    fields: arrayFields.map((f) => new Field(f)),
  };

  document.getElementById("result").innerText = main(config);
}

function createField() {
  const fieldsContainer = document.getElementById("fields-container");
  const newField = document.createElement("div");
  newField.classList.add("field");
  newField.innerHTML = `
        <label for="name">
          Nombre
        </label>
        <input class="field-name" />
        <label for="questions">
          Preguntas
        </label>
        <input class="field-questions" />
      `;
  fieldsContainer.appendChild(newField);
}

function getFields() {
  let fields = document.querySelectorAll(".field");

  const fieldArray = [];

  fields.forEach((field) => {
    const name = field.querySelector(".field-name").value;
    const questions = numberCommaString(
      field.querySelector(".field-questions").value,
    );
    fieldArray.push({ name, questions });
  });

  return fieldArray;
}

function numberCommaString(str) {
  console.log("str:", str);
  return str.split(",").map((n) => parseInt(n));
}
