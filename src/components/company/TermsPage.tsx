import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-blue-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-white text-lg">
            Last updated: April 1, 2025
          </p>
        </div>
      </div>
      
      {/* Terms Content */}
      <div className="py-16 px-4 bg-white flex-grow">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2>1. Introduction</h2>
          <p>
            Welcome to GetListed ("Company", "we", "our", "us")! These Terms of Service ("Terms", "Terms of Service") govern your use of our website located at getlisted.com (together or individually "Service") operated by GetListed Technologies, Inc.
          </p>
          <p>
            Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound by them.
          </p>
          <p>
            If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at support@getlisted.com so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.
          </p>
          
          <h2>2. Communications</h2>
          <p>
            By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at support@getlisted.com.
          </p>
          
          <h2>3. Purchases</h2>
          <p>
            If you wish to purchase any product or service made available through Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
          </p>
          <p>
            You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
          </p>
          <p>
            We may employ the use of third-party services for the purpose of facilitating payment and the completion of Purchases. By submitting your information, you grant us the right to provide the information to these third parties subject to our Privacy Policy.
          </p>
          <p>
            We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.
          </p>
          <p>
            We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.
          </p>
          
          <h2>4. Subscriptions</h2>
          <p>
            Some parts of Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
          </p>
          <p>
            At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or GetListed Technologies, Inc. cancels it. You may cancel your Subscription renewal either through your online account management page or by contacting GetListed Technologies, Inc. customer support team.
          </p>
          <p>
            A valid payment method, including credit card or PayPal, is required to process the payment for your Subscription. You shall provide GetListed Technologies, Inc. with accurate and complete billing information including full name, address, state, zip code, telephone number, and a valid payment method information. By submitting such payment information, you automatically authorize GetListed Technologies, Inc. to charge all Subscription fees incurred through your account to any such payment instruments.
          </p>
          <p>
            Should automatic billing fail to occur for any reason, GetListed Technologies, Inc. will issue an electronic invoice indicating that you must proceed manually, within a certain deadline date, with the full payment corresponding to the billing period as indicated on the invoice.
          </p>
          
          <h2>5. Content</h2>
          <p>
            Content found on or through this Service are the property of GetListed Technologies, Inc. or used with permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.
          </p>
          
          <h2>6. Prohibited Uses</h2>
          <p>
            You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:
          </p>
          <ul>
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
            <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
            <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of Service, or which, as determined by us, may harm or offend Company or users of Service or expose them to liability.</li>
          </ul>
          
          <h2>7. Changes to Service</h2>
          <p>
            We reserve the right to withdraw or amend our Service, and any service or material we provide via Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of Service is unavailable at any time or for any period. From time to time, we may restrict access to some parts of Service, or the entire Service, to users, including registered users.
          </p>
          
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at legal@getlisted.com.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsPage;