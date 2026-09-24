document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("nav a").forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("[data-current-year]").forEach((year) => {
    year.textContent = new Date().getFullYear();
  });

  const registrationRoot = document.querySelector("#registration-root");
  if (!registrationRoot || !window.React || !window.ReactDOM) return;

  const { useState } = window.React;
  const e = window.React.createElement;

  function RegistrationForm() {
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      learningInterest: "",
      terms: false,
    });
    const [submitted, setSubmitted] = useState(false);

    const updateField = (event) => {
      const { name, value, type, checked } = event.target;
      setFormData((current) => ({
        ...current,
        [name]: type === "checkbox" ? checked : value,
      }));
      setSubmitted(false);
    };

    const submitForm = (event) => {
      event.preventDefault();
      if (formData.password !== formData.confirmPassword) return;
      setSubmitted(true);
    };

    const field = (label, name, type = "text", extra = {}) =>
      e("div", { className: "form-field", key: name }, [
        e("label", { htmlFor: name }, label),
        e("input", {
          id: name,
          name,
          type,
          value: formData[name],
          onChange: updateField,
          required: true,
          ...extra,
        }),
      ]);

    if (submitted) {
      return e(
        "p",
        { className: "registration-success", role: "status" },
        "Thanks for registering! Your learning interests have been saved for this demo.",
      );
    }

    return e("form", { className: "registration-form", onSubmit: submitForm }, [
      field("Full name", "fullName", "text", { autoComplete: "name" }),
      field("Email address", "email", "email", { autoComplete: "email" }),
      field("Password", "password", "password", {
        minLength: 8,
        autoComplete: "new-password",
      }),
      field("Confirm password", "confirmPassword", "password", {
        minLength: 8,
        autoComplete: "new-password",
      }),
      e("div", { className: "form-field", key: "learningInterest" }, [
        e("label", { htmlFor: "learningInterest" }, "Learning interest"),
        e(
          "select",
          {
            id: "learningInterest",
            name: "learningInterest",
            value: formData.learningInterest,
            onChange: updateField,
            required: true,
          },
          [
            e("option", { value: "", key: "empty" }, "Choose an option"),
            e(
              "option",
              { value: "online-learning", key: "online" },
              "Online learning",
            ),
            e(
              "option",
              { value: "educational-apps", key: "apps" },
              "Educational apps",
            ),
            e(
              "option",
              { value: "artificial-intelligence", key: "ai" },
              "Artificial intelligence",
            ),
          ],
        ),
      ]),
      e(
        "label",
        { className: "checkbox-field", htmlFor: "terms", key: "terms" },
        [
          e("input", {
            type: "checkbox",
            id: "terms",
            name: "terms",
            checked: formData.terms,
            onChange: updateField,
            required: true,
          }),
          e("span", null, "I agree to the terms and conditions."),
        ],
      ),
      formData.confirmPassword && formData.password !== formData.confirmPassword
        ? e(
            "p",
            { className: "form-error", key: "error" },
            "Passwords must match.",
          )
        : null,
      e(
        "button",
        {
          type: "submit",
          disabled:
            formData.password !== formData.confirmPassword &&
            formData.confirmPassword !== "",
          key: "submit",
        },
        "Create account",
      ),
    ]);
  }

  window.ReactDOM.createRoot(registrationRoot).render(e(RegistrationForm));
});
