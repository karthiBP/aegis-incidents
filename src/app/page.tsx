'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clock,
  FileText,
  Share2,
  Zap,
  CheckCircle2,
  ArrowRight,
  Shield,
  Users,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const features = [
  {
    icon: Clock,
    title: '10 Minutes, Not 10 Hours',
    description: 'Generate complete, professional postmortems faster than writing an email.',
  },
  {
    icon: FileText,
    title: 'Executive-Ready Reports',
    description: 'AI crafts clear, blame-free documentation that impresses leadership and clients.',
  },
  {
    icon: Share2,
    title: 'One-Click Sharing',
    description: 'Generate public links to share with stakeholders, investors, or customers.',
  },
  {
    icon: Zap,
    title: 'Guided Workflow',
    description: 'Simple step-by-step wizard—no technical expertise required.',
  },
];

const benefits = [
  'Save 6-8 engineering hours per incident',
  'Consistent, professional documentation',
  'Blame-free, accountability-focused tone',
  'Actionable improvement recommendations',
  'Export to Markdown or copy for Notion/Docs',
  'Public shareable links for transparency',
];

const pricingPlans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: '',
    description: 'Try it with one incident',
    features: ['1 demo-quality incident', 'Full AI generation', 'Markdown export'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pay Per Incident',
    price: '$49',
    period: '/incident',
    description: 'Perfect for occasional incidents',
    features: ['Unlimited AI regenerations', 'Public shareable links', 'Priority support'],
    cta: 'Buy Now',
    popular: false,
  },
  {
    name: 'Unlimited',
    price: '$199',
    period: '/month',
    description: 'For teams with frequent incidents',
    features: ['Unlimited incidents', 'Team access (soon)', 'Custom branding (soon)', 'API access (soon)'],
    cta: 'Subscribe',
    popular: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              AI-Powered Incident Postmortems
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              This postmortem took{' '}
              <span className="gradient-text">8 minutes</span>.
              <br />
              Normally, it takes{' '}
              <span className="text-gray-400">8 hours</span>.
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Generate professional, executive-ready incident documentation in minutes.
              Stop wasting engineering time on paperwork after outages.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 px-8 text-lg">
                  Generate Your First Postmortem
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/example">
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 text-lg">
                  View Example Report
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Free to try • No credit card required
            </p>
          </motion.div>

          {/* Hero Image/Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-4 text-sm text-gray-600">AEGIS INCIDENTS - Postmortem Report</span>
              </div>
              <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="prose-incident max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Database Connection Pool Exhaustion
                  </h2>
                  <p className="text-gray-500 mb-4">47-Minute API Outage • Critical Severity</p>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Executive Summary</h3>
                    <p className="text-blue-800">
                      On January 15th, our primary API experienced a 47-minute outage due to database connection
                      pool exhaustion. Approximately 2,400 customers were affected. The issue was resolved by
                      increasing pool limits and implementing query optimization.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900">47m</div>
                      <div className="text-sm text-gray-600">Duration</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900">2,400</div>
                      <div className="text-sm text-gray-600">Affected Users</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900">5</div>
                      <div className="text-sm text-gray-600">Action Items</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for professional postmortems
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for startups, engineering teams, and agencies who need to explain incidents clearly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Why teams love AEGIS INCIDENTS
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Stop dreading the paperwork after every incident. Let AI handle the documentation
                while you focus on prevention.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-white font-semibold">Built for</div>
                  <div className="text-blue-200">Engineering Teams</div>
                </div>
              </div>
              <ul className="space-y-4 text-white/90">
                <li className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>Startup founders explaining issues to investors</span>
                </li>
                <li className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>DevOps/SRE teams documenting outages</span>
                </li>
                <li className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>Agencies reporting to clients</span>
                </li>
                <li className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>Engineering managers creating blameless reviews</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pay only when you need it. No hidden fees, no surprise charges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${plan.popular ? 'border-blue-500 border-2 shadow-xl' : 'border-gray-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardContent className="pt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/signup">
                      <Button
                        className={`w-full ${plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to save hours on your next incident?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join teams who&apos;ve already transformed their incident response documentation.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 px-12 text-lg">
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
