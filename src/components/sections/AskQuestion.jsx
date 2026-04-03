import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AskQuestion() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("form");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {

    if (!formData.name.trim())
      return "Full name is required";

    if (!formData.email.trim())
      return "Email is required";

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email))
      return "Invalid email address";

    if (!formData.question.trim())
      return "Question is required";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validate();

    if (validation) {
      setStatus("error");
      return;
    }

    setLoading(true);

    try {

      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("question", formData.question);

      formDataToSend.append(
        "key",
        import.meta.env.VITE_FORM_SECRET
      );

      const response = await fetch(
        import.meta.env.VITE_GOOGLE_SCRIPT_URL,
        {
          method: "POST",
          body: formDataToSend
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          question: ""
        });
      } else {
        setStatus("error");
      }

    } catch (err) {
      setStatus("error");
    }

    setLoading(false);
  };

  return (

    <section id="contact" className="py-24 px-6">

      <div className="max-w-5xl mx-auto">

        {/* Heading */}

        <div className="text-center mb-12">

          <h2 className="text-5xl font-bold text-purple-400 mb-2">
            ASK A QUESTION
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a question that wasn't covered in our FAQ? We'd love to hear from you and
            provide personalized assistance.
          </p>

        </div>


        {/* Card */}

        <div className="relative">

          <div className="absolute inset-0 bg-purple-600/10 blur-3xl" />

          <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8">

            <AnimatePresence mode="wait">

              {/* FORM */}

              {status === "form" && (

                <motion.div
                  key="form"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >

                    <div className="grid md:grid-cols-2 gap-6">

                      <div>

                        <label className="text-sm text-gray-300 mb-2 block">
                          FULL NAME
                        </label>

                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-3 rounded-md 
                          bg-white/5 border border-white/10 
                          focus:border-purple-500 
                          outline-none transition text-white"
                        />

                      </div>


                      <div>

                        <label className="text-sm text-gray-300 mb-2 block">
                          EMAIL ADDRESS
                        </label>

                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-3 rounded-md 
                          bg-white/5 border border-white/10 
                          focus:border-purple-500 
                          outline-none transition text-white"
                        />

                      </div>

                    </div>


                    <div>

                      <label className="text-sm text-gray-300 mb-2 block">
                        YOUR QUESTION
                      </label>

                      <textarea
                        name="question"
                        placeholder="Explain your question in detail..."
                        rows="5"
                        value={formData.question}
                        onChange={handleChange}
                        className="w-full p-3 rounded-md 
                        bg-white/5 border border-white/10 
                        focus:border-purple-500 
                        outline-none transition text-white"
                      />

                    </div>


                    <div className="flex justify-center pt-4">

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        disabled={loading}
                        className="px-8 py-3 rounded-md 
                        bg-purple-600 hover:bg-purple-700 
                        transition font-medium"
                      >

                        {loading ? "Sending..." : "SEND QUESTION"}

                      </motion.button>

                    </div>

                  </form>

                </motion.div>
              )}


              {/* SUCCESS */}

              {status === "success" && (

                <motion.div
                  key="success"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-16"
                >

                  <div className="flex justify-center mb-6">

                    <svg width="90" height="90" viewBox="0 0 24 24"
                      className="text-green-400"
                      fill="none">

                      <circle cx="12" cy="12" r="10"
                        stroke="currentColor"
                        strokeWidth="2"/>

                      <path d="M7 12L10 15L17 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"/>

                    </svg>

                  </div>

                  <h3 className="text-3xl font-semibold mb-2">
                    Question Submitted
                  </h3>

                  <p className="text-gray-400 mb-6">
                    We'll get back to you shortly
                  </p>

                  <button
                    onClick={() => setStatus("form")}
                    className="px-6 py-3 rounded-md border 
                    border-green-400 text-green-400 
                    hover:bg-green-400 hover:text-black transition"
                  >
                    Submit Another Question
                  </button>

                </motion.div>
              )}


              {/* ERROR */}

              {status === "error" && (

                <motion.div
                  key="error"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center py-16"
                >

                  <h3 className="text-3xl font-semibold mb-2 text-red-400">
                    Submission Failed
                  </h3>

                  <p className="text-gray-400 mb-6">
                    Please try again later
                  </p>

                  <button
                    onClick={() => setStatus("form")}
                    className="px-6 py-3 rounded-md border 
                    border-red-400 text-red-400 
                    hover:bg-red-400 hover:text-black transition"
                  >
                    Try Again
                  </button>

                </motion.div>
              )}

            </AnimatePresence>

          </div>

        </div>

      </div>

    </section>
  );
}