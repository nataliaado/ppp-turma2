import http from "k6/http";
import { check, sleep, group } from "k6";

export const options = {
  vus: 10,
  duration: "20s",
  thresholds: {
    http_req_duration: ["p(90) <= 17", "p(95) <= 20"],
    http_req_failed: ["rate < 0.01"],
  },
};

export default function () {
  let responseInstructorLogin = "";

  group("Fazendo Login", () => {
    responseInstructorLogin = http.post(
      "http://localhost:3000/instructors/login",
      JSON.stringify({
        email: "nat@email.com",
        password: "123456",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  });

  group("Registrando uma nova Lição", () => {
    let responseLesson = http.post(
      "http://localhost:3000/lessons",
      JSON.stringify({
        title: "Como montar a flauta transversal",
        description:
          "Montando as tres partes da flauta transversal e alinhando as peças",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${responseInstructorLogin.json("token")}`,
        },
      }
    );

    check(responseLesson, {
      "status deve ser igual a 201": (res) => res.status === 201,
    });
  });

  group("Simulando o pensamento do Usuário", () => {
    sleep(1); // User Think Time
  });
}
