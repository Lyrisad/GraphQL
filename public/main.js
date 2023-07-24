let errorMsg = document.querySelector(".errorMsg");
let first_name = "";
let lastName = "";
let mail = "";
let phone = "";
let imagePath = "";
let campusLocation = "";

//const endpoint = 'https://zone01normandie.org/api/graphql-engine/v1/graphql';
const endpoint = "https://zone01normandie.org/api/auth/signin";

const profile = `
   
    user {
        attrs
        campus
    }
    
    `;

const skill_go = `user {
transactions(where: {type: {_eq: "skill_go"}} order_by :{amount: asc })  {
    createdAt
    amount
    type
    path
    
    
  }
}`;


const requêteXp = "user { xps { amount } firstName }";

const auditRatio =
  "user { audits(order_by: {createdAt: asc}, where: {grade: {_is_null: false}}) { grade createdAt} }";

document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();
  let username = document.querySelector(".name").value;
  let password = document.querySelector(".password").value;
  if (username == "" || password == "") {
    errorMsg.style.display = "block";
    return;
  }

  const base64 = btoa(`${username}:${password}`);
  console.log(username, password);
  const tokken = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64}`,
    },
  })
    .then((response) => response.json())
    .then((tokken) => {
      localStorage.setItem("tokken", tokken);
      return tokken;
    });
  console.log(tokken);
  await fetch("https://zone01normandie.org/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokken}`,
    },
    body: JSON.stringify({
      query: `query { ${profile} }`,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      first_name, (err = data.data.user[0].attrs.firstName);
      lastName = data.data.user[0].attrs.lastName;
      mail = data.data.user[0].attrs.email;
      phone = data.data.user[0].attrs.Phone;
      imagePath = data.data.user[0].attrs.image;
      campusLocation = data.data.user[0].campus;
      console.log(
        username,
        " username ",
        mail,
        " mail ",
        phone,
        " phone ",
        imagePath,
        " imagePath ",
        campusLocation,
        " campusLocation "
      );
    });


      await fetch("https://zone01normandie.org/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokken}`,
    },
    body: JSON.stringify({
      query: `query { ${auditRatio} }`,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      graphRatioAmount = document.querySelector(".graphRatioAmount");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "800");
      svg.setAttribute("height", "400");

      const ratioData = data.data.user[0].audits;

      const xScale = d3
        .scaleLinear()
        .domain([0, ratioData.length - 1])
        .range([0, 800]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(ratioData, (d) => d.grade)])
        .range([400, 0]);

      const line = d3
        .line()
        .x((d, i) => xScale(i))
        .y((d) => yScale(d.grade));

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", line(ratioData));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "blue");

      svg.appendChild(path);
      graphRatioAmount.appendChild(svg);
      const xAxisLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      xAxisLabel.setAttribute("x", "400");
      xAxisLabel.setAttribute("y", "390");
      xAxisLabel.setAttribute("text-anchor", "middle");
      xAxisLabel.textContent = "2022 - 2023"; // Update the x-axis label
      svg.appendChild(xAxisLabel);

      const yAxisLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      yAxisLabel.setAttribute("x", "-200");
      yAxisLabel.setAttribute("y", "10");
      yAxisLabel.setAttribute("transform", "rotate(-90)");
      yAxisLabel.setAttribute("text-anchor", "middle");
      yAxisLabel.textContent = `Y Axis Label (${100000})`; // Update the y-axis label with the dynamic value
      svg.appendChild(yAxisLabel);
    });

  await fetch("https://zone01normandie.org/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokken}`,
    },
    body: JSON.stringify({
      query: `query { ${requêteXp} }`,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      graphXpAmount = document.querySelector(".graphXpAmount");
      console.log(data);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "800");
      svg.setAttribute("height", "400");

      const xpsData = data.data.user[0].xps; // Assuming the structure of the response data

      const xScale = d3
        .scaleLinear()
        .domain([0, xpsData.length - 1])
        .range([0, 800]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(xpsData, (d) => d.amount)])
        .range([400, 0]);

      const line = d3
        .line()
        .x((d, i) => xScale(i))
        .y((d) => yScale(d.amount));

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", line(xpsData));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "blue");

      svg.appendChild(path);
      graphXpAmount.appendChild(svg);
      const xAxisLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      xAxisLabel.setAttribute("x", "400");
      xAxisLabel.setAttribute("y", "390");
      xAxisLabel.setAttribute("text-anchor", "middle");
      xAxisLabel.textContent = "2022 - 2023"; // Update the x-axis label
      svg.appendChild(xAxisLabel);

      const yAxisLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      yAxisLabel.setAttribute("x", "-200");
      yAxisLabel.setAttribute("y", "10");
      yAxisLabel.setAttribute("transform", "rotate(-90)");
      yAxisLabel.setAttribute("text-anchor", "middle");
      yAxisLabel.textContent = `Y Axis Label (${100000})`; // Update the y-axis label with the dynamic value
      svg.appendChild(yAxisLabel);
    });

  await fetch("https://zone01normandie.org/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokken}`,
    },
    body: JSON.stringify({
      query: `query { ${skill_go} }`,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      graphSkillAmount = document.querySelector(".graphSkillAmount");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "800");
      svg.setAttribute("height", "400");
  
      const SkillData = data.data.user[0].transactions;
  
      const xScale = d3
        .scaleLinear()
        .domain([0, SkillData.length - 1])
        .range([0, 800]);
  
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(SkillData, (d) => d.amount)])
        .range([400, 0]);
  
      const line = d3
        .line()
        .x((d, i) => xScale(i))
        .y((d) => yScale(d.amount));
  
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", line(SkillData));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "blue");
  
      svg.appendChild(path);
      graphSkillAmount.appendChild(svg);
      const xAxisLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      xAxisLabel.setAttribute("x", "400");
      xAxisLabel.setAttribute("y", "390");
      xAxisLabel.setAttribute("text-anchor", "middle");
      xAxisLabel.textContent = "2022 - 2023"; // Update the x-axis label
      svg.appendChild(xAxisLabel);
  
      const yAxisLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      yAxisLabel.setAttribute("x", "-200");
      yAxisLabel.setAttribute("y", "10");
      yAxisLabel.setAttribute("transform", "rotate(-90)");
      yAxisLabel.setAttribute("text-anchor", "middle");
      yAxisLabel.textContent = `Y Axis Label (${100000})`; // Update the y-axis label with the dynamic value
      svg.appendChild(yAxisLabel);
      //localStorage.setItem('user', JSON.stringify(data.data.user));
      if (tokken.error) {
        errorMsg.innerHTML = "Identifiant ou mot de passe incorrect";
        errorMsg.style.display = "block";
        return;
      } else {
        document.querySelector("body").style.height = "100%";
        document.querySelector(".loginFormDiv").style.display = "none";
        usernameTitle = document.querySelector(".usernameTitle");
        document.querySelector(".profileDiv").style.display = "flex";
        document.querySelector(".imagePathing").src = imagePath;
        document.querySelector(".userEmail").innerHTML =
          "<span class='Span'>" + "Adresse mail: " + "</span>" + mail;
        document.querySelector(".userPhoneNumber").innerHTML =
          "<span class='Span'>" + "Telephone: " + "</span>" + phone;
        document.querySelector(".userCampus").innerHTML =
          "<span class='Span'>" + "Campus: " + "</span>" + campusLocation;
        usernameTitle.innerHTML = first_name + " " + lastName;
      }
    });
});
