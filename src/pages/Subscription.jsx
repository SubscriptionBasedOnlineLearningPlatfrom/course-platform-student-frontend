import { useApi } from "@/contexts/ApiContext";
import React from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";

const Subscription = () => {
  const {courseId} = useParams();
  const {BackendAPI} = useApi();

  // Plans array
  const plans = [
    {
      name: "Basic",
      description: "Great for trying things out",
      price: "LKR 7000",
      period: "/mo",
      priceId: "price_1SCAqW2LGc18PwLdKpU2hMUf",
      features: [
        "Access to selected courses",
        "Community forum",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Pro",
      description: "Everything you need to learn fast",
      price: "LKR 10000",
      period: "/mo",
      priceId: "price_1SCArY2LGc18PwLdFFsvhmOK",
      features: [
        "All current courses",
        "Quizzes & assignments",
        "Certificate on completion",
        "Priority support",
      ],
      popular: true,
    },
  ];

  const handleSubscribe = async (priceId,plan) => {
    try {
      const studentToken = localStorage.getItem("studentToken");

      const response = await axios.post(
        `${BackendAPI}/subscription/create-checkout-session`,
        { priceId,
          courseId,
          plan
         }, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${studentToken}`, 
          },
        }
      );
      window.location.href = response.data.session_url;

    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#0173d1] to-[#85c1f3] bg-clip-text text-transparent">
              Choose your plan
            </h1>
            <p className="text-gray-600 mt-1">
              Get unlimited learning with a membership, or upgrade when you need
              more.
            </p>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col ${
                plan.popular ? "ring-2 ring-blue-200" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white shadow">
                  Popular
                </span>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>

              <div className="mb-4">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.price}
                </span>
                <span className="ml-1 text-sm text-gray-500">
                  {plan.period}
                </span>
              </div>

              <div className="h-px bg-gray-200/70 my-2" />

              <ul className="mt-3 space-y-2 text-sm text-gray-700 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m5 13 4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <button
                  onClick={() => handleSubscribe(plan.priceId, plan.name)}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow cursor-pointer"
                >
                  Choose {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info blocks */}
        <div className="mt-10 grid md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white/70 rounded-2xl p-5 border border-white/30">
            <p className="font-semibold text-gray-800">What’s included?</p>
            <p className="text-gray-600 mt-1">
              Subscriptions grant access while active. You can switch plans or
              cancel before renewal.
            </p>
          </div>
          <div className="bg-white/70 rounded-2xl p-5 border border-white/30">
            <p className="font-semibold text-gray-800">Billing</p>
            <p className="text-gray-600 mt-1">
              Yearly plans are billed upfront at a discount. Prices shown are
              totals for the selected cycle.
            </p>
          </div>
          <div className="bg-white/70 rounded-2xl p-5 border border-white/30">
            <p className="font-semibold text-gray-800">Invoices & tax</p>
            <p className="text-gray-600 mt-1">
              We provide invoices after checkout. Taxes may apply based on your
              location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
