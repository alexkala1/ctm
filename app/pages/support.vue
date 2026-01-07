<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <img src="/icon.svg" alt="Chess Tournament Manager" class="h-16 w-16" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Support Center</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">Get help with Chess Tournament Manager</p>
      </div>

      <!-- Contact Information -->
      <UCard class="mb-8">
        <template #header>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
        </template>

        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Support</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-2">For technical issues and general inquiries:</p>
            <UButton variant="link" color="primary" href="mailto:support@chesstournament.com" external>
              support@chesstournament.com
            </UButton>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Response Time</h3>
            <p class="text-gray-600 dark:text-gray-400">We typically respond within 24 hours during business days.</p>
          </div>
        </div>
      </UCard>

      <!-- FAQ Section -->
      <UCard class="mb-8">
        <template #header>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        </template>

        <UAccordion :items="faqItems" type="multiple" />
      </UCard>

      <!-- Documentation Links -->
      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Documentation</h2>
        </template>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Getting Started</h3>
            <ul class="space-y-2">
              <li>
                <UButton variant="link" color="primary" href="#"> Creating Your First Tournament </UButton>
              </li>
              <li>
                <UButton variant="link" color="primary" href="#"> Managing Participants </UButton>
              </li>
              <li>
                <UButton variant="link" color="primary" href="#"> Tournament Settings </UButton>
              </li>
            </ul>
          </div>
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Advanced Features</h3>
            <ul class="space-y-2">
              <li>
                <UButton variant="link" color="primary" href="#"> Import/Export Data </UButton>
              </li>
              <li>
                <UButton variant="link" color="primary" href="#"> Custom Tournament Formats </UButton>
              </li>
              <li>
                <UButton variant="link" color="primary" href="#"> API Documentation </UButton>
              </li>
            </ul>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// FAQ data for UAccordion
const faqItems = [
  {
    label: 'How do I create a new tournament?',
    content:
      "To create a new tournament, click the 'Create Tournament' button on the main page, fill in the tournament details including name, date, and format, then add participants. You can also import participants from a CSV file if you have a large list.",
  },
  {
    label: 'Can I import participant data from Excel or CSV?',
    content:
      "Yes! You can import participant data from CSV files. Go to the tournament page, click on 'Import Participants', and upload your CSV file. Make sure your file has columns for participant names and any other required information.",
  },
  {
    label: 'How do I manage tournament brackets?',
    content:
      'Tournament brackets are automatically generated based on your tournament format (Swiss, Round Robin, etc.). You can view and manage matches from the tournament details page, and the system will automatically advance winners to the next round.',
  },
  {
    label: 'Can multiple people manage the same tournament?',
    content:
      'Currently, tournament management is limited to the tournament creator. However, you can share tournament results and standings with others by sharing the tournament link or exporting the data.',
  },
  {
    label: 'What happens if I lose my data?',
    content:
      'Your tournament data is automatically saved and backed up. If you experience data loss, please contact our support team immediately. We can help restore your data from our backups.',
  },
  {
    label: 'Is there a mobile app available?',
    content:
      "Chess Tournament Manager is a web application that works great on mobile devices through your browser. We're working on dedicated mobile apps for iOS and Android, which will be available soon.",
  },
  {
    label: 'How do I export tournament results?',
    content:
      "You can export tournament results in multiple formats including PDF, Excel, and CSV. Go to the tournament details page and click the 'Export' button to choose your preferred format.",
  },
  {
    label: 'Can I customize tournament settings?',
    content:
      'Yes! You can customize various tournament settings including time controls, scoring systems, tie-breaking methods, and more. These options are available when creating or editing a tournament.',
  },
];

// Page metadata
definePageMeta({
  title: 'Support - Chess Tournament Manager',
  description:
    'Get help with Chess Tournament Manager. Find answers to frequently asked questions and contact our support team.',
  auth: false,
});
</script>
