import React from "react";
import {
  FiHelpCircle,
  FiPhone,
  FiMail,
  FiInfo,
} from "react-icons/fi";

const HelpAndSupport = () => {
  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold mb-6">Help & Support</h1>

      <div className="max-w-3xl space-y-6">
        {/* ABOUT */}
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiInfo className="text-orange-400" />
            <h2 className="font-semibold">About Khata Book</h2>
          </div>
          <p className="text-sm text-gray-400">
            Khata Book helps you manage money you <b>give</b> and <b>take</b>
            from people. All entries are saved securely and shown date-wise,
            just like a real khata.
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FiHelpCircle className="text-orange-400" />
            <h2 className="font-semibold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">➤ What does “Taken” mean?</p>
              <p className="text-gray-400">
                Taken means you received money from someone.
              </p>
            </div>

            <div>
              <p className="font-medium">➤ What does “Given” mean?</p>
              <p className="text-gray-400">
                Given means you gave money to someone.
              </p>
            </div>

            <div>
              <p className="font-medium">➤ Can I edit or delete entries?</p>
              <p className="text-gray-400">
                Yes. Use the edit and delete icons next to each transaction.
              </p>
            </div>

            <div>
              <p className="font-medium">➤ Is my data secure?</p>
              <p className="text-gray-400">
                Yes. Your data is linked to your account and stored securely.
              </p>
            </div>
          </div>
        </div>

        {/* CONTACT SUPPORT */}
        <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4">
          <h2 className="font-semibold mb-3">Contact Support</h2>

          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FiMail className="text-orange-400" />
              <span>support@ExpensePro.app</span>
            </div>

            <div className="flex items-center gap-2">
              <FiPhone className="text-orange-400" />
              <span>+91 9XXXXXXXXX</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Khata Book • All rights reserved
        </p>
      </div>
    </div>
  );
};

export default HelpAndSupport;
