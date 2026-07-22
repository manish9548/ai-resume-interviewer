import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "Is AI Resume Interviewer free?",
    answer: "Yes. You can register and start preparing for free.",
  },
  {
    question: "Can I prepare for Amazon?",
    answer: "Yes. You can generate company-specific interview questions.",
  },
  {
    question: "Do I get PDF reports?",
    answer: "Yes. You can download your interview report as a PDF.",
  },
  {
    question: "Can I upload multiple resumes?",
    answer: "Yes. You can upload and manage multiple resumes.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold">
            Frequently Asked{" "}
            <span className="text-blue-600">Questions</span>
          </h2>

          <p className="text-gray-600 mt-4">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >

              <div className="flex justify-between items-center">

                <h3 className="font-semibold text-lg">
                  {faq.question}
                </h3>

                {openIndex === index ? (
                  <FaMinus className="text-blue-600" />
                ) : (
                  <FaPlus className="text-blue-600" />
                )}

              </div>

              {openIndex === index && (
                <p className="mt-4 text-gray-600">
                  {faq.answer}
                </p>
              )}

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default FAQ;