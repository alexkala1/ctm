<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <img 
            src="/icon.svg" 
            alt="Chess Tournament Manager" 
            class="h-16 w-16" 
          >
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <UBadge
          color="neutral"
          variant="subtle"
          size="lg"
        >
          Last updated: {{ lastUpdated }}
        </UBadge>
      </div>

      <!-- Content -->
      <UCard>
        <div class="prose prose-lg max-w-none dark:prose-invert">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, 
            create or manage tournaments, or contact us for support.
          </p>
          
          <h3>1.1 Personal Information</h3>
          <ul>
            <li><strong>Account Information:</strong> Email address, username, and password</li>
            <li><strong>Profile Information:</strong> Name, profile picture, and other information you choose to provide</li>
            <li><strong>Tournament Data:</strong> Tournament names, participant information, results, and settings</li>
            <li><strong>Communication Data:</strong> Messages you send to us for support or feedback</li>
          </ul>

          <h3>1.2 Automatically Collected Information</h3>
          <ul>
            <li><strong>Usage Data:</strong> How you interact with our service, pages visited, and features used</li>
            <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
            <li><strong>Cookies and Similar Technologies:</strong> We use cookies to enhance your experience and analyze usage</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze usage and trends</li>
            <li>Detect, investigate, and prevent security incidents</li>
          </ul>

          <h2>3. Information Sharing and Disclosure</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
          <ul>
            <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
            <li><strong>Service Providers:</strong> Trusted third parties who assist us in operating our service</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. This includes:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication measures</li>
            <li>Secure data centers and infrastructure</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our services and 
            fulfill the purposes outlined in this privacy policy. Tournament data is retained until you 
            delete your account or specific tournaments.
          </p>

          <h2>6. Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          </ul>

          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
            and provide personalized content. You can control cookie settings through your browser preferences.
          </p>

          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. 
            We ensure appropriate safeguards are in place to protect your information in accordance 
            with applicable data protection laws.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If you are a parent or guardian and believe your 
            child has provided us with personal information, please contact us.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by 
            posting the new privacy policy on this page and updating the "Last updated" date. Your continued 
            use of our service after any changes constitutes acceptance of the updated policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our data practices, please contact us at:
          </p>
          <ul>
            <li><strong>Email:</strong> privacy@chesstournament.com</li>
            <li><strong>Address:</strong> Chess Tournament Manager, Privacy Team, 123 Chess Street, Game City, GC 12345</li>
          </ul>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
const lastUpdated = 'January 15, 2025'

definePageMeta({
  title: 'Privacy Policy - Chess Tournament Manager',
  description: 'Learn how Chess Tournament Manager collects, uses, and protects your personal information and tournament data.',
  auth: false
})
</script>
