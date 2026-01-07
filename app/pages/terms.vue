<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <img src="/icon.svg" alt="Chess Tournament Manager" class="h-16 w-16" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
        <UBadge color="neutral" variant="subtle" size="lg"> Last updated: {{ lastUpdated }} </UBadge>
      </div>

      <!-- Content -->
      <UCard>
        <div class="prose prose-lg max-w-none dark:prose-invert">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Chess Tournament Manager ("the Service"), you accept and agree to be bound terms and
            provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Chess Tournament Manager is a web-based application that allows users to create, manage, and organize chess
            tournaments. The service includes features for participant management, bracket generation, result tracking,
            and data export capabilities.
          </p>

          <h2>3. User Accounts</h2>
          <h3>3.1 Account Creation</h3>
          <p>
            To use certain features of the Service, you must create an account. You agree to provide accurate, and
            complete information during the registration process and to update such information to keep it accurate,
            current, and complete.
          </p>

          <h3>3.2 Account Security</h3>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all that occur
            under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>

          <h2>4. Acceptable Use</h2>
          <h3>4.1 Permitted Uses</h3>
          <p>You may use the Service to:</p>
          <ul>
            <li>Create and manage chess tournaments</li>
            <li>Organize participant data and tournament results</li>
            <li>Export tournament data for personal use</li>
            <li>Share tournament information with participants</li>
          </ul>

          <h3>4.2 Prohibited Uses</h3>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Transmit harmful or malicious code</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Use the Service for commercial purposes without permission</li>
            <li>Upload or share inappropriate or offensive content</li>
            <li>Interfere with the proper functioning of the Service</li>
          </ul>

          <h2>5. User Content</h2>
          <h3>5.1 Content Ownership</h3>
          <p>
            You retain ownership of all content you upload, create, or share through the Service ("User Content"). using
            the Service, you grant us a limited license to use, store, and process your User Content solely for the
            purpose of providing the Service.
          </p>

          <h3>5.2 Content Responsibility</h3>
          <p>
            You are solely responsible for your User Content and the consequences of sharing it. You represent warrant
            that you have all necessary rights to your User Content and that it does not violate any third-party rights.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by Chess Tournament Manager are
            protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <h2>7. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of Service,
            to understand our practices regarding the collection and use of your information.
          </p>

          <h2>8. Service Availability</h2>
          <p>
            We strive to provide continuous service availability but cannot guarantee uninterrupted access. may be
            temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right to modify or
            discontinue the Service at any time.
          </p>

          <h2>9. Data Export and Backup</h2>
          <p>
            You are responsible for backing up your tournament data. While we make reasonable efforts to protect data,
            we cannot guarantee against data loss. We provide export functionality to help you maintain copies of your
            data.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Chess Tournament Manager shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, including without limitation, loss of profits,
            data, use, goodwill, or other intangible losses, resulting from your use of the Service.
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Chess Tournament Manager and its officers, directors,
            employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, debt,
            and expenses (including attorney's fees) arising from your use of the Service or violation of these Terms.
          </p>

          <h2>12. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice
            liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon
            termination, your right to use the Service will cease immediately.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which Chess Tournament
            Manager operates, without regard to its conflict of law provisions.
          </p>

          <h2>14. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a material,
            we will try to provide at least 30 days notice prior to any new terms taking effect. Your continued use of
            the Service after any changes constitutes acceptance of the new Terms.
          </p>

          <h2>15. Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us at:</p>
          <ul>
            <li><strong>Email:</strong> legal@chesstournament.com</li>
            <li>
              <strong>Address:</strong> Chess Tournament Manager, Legal Department, 123 Chess Street, Game City, GC
              12345
            </li>
          </ul>

          <h2>16. Severability</h2>
          <p>
            If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining of these
            Terms will remain in effect.
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
const lastUpdated = 'January 15, 2025';

definePageMeta({
  title: 'Terms of Service - Chess Tournament Manager',
  description: 'Read the terms and conditions for using Chess Tournament Manager service.',
  auth: false,
});
</script>
