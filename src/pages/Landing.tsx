import { Button } from "../components/ui/button";
import { CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import logo from "../public/images/logo.jpg";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  CreditCard,
  FileText,
  FolderOpen,
  MessageCircle,
  Play,
  Star,
  TrendingUp,
  Upload,
  UserCheck,
  Briefcase,
  Target,
  Mail,
  Download,
  DollarSign,
  Smile,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { useEffect, useState } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const testimonialVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};
export default function Landing() {


  const [isDark, setIsDark] = useState<boolean>(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const stats = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      value: "2,500+",
      label: "Active Users",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-yellow-500" />,
      value: "15,000+",
      label: "Projects Managed",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      value: "$2M+",
      label: "Invoices Processed",
    },
    {
      icon: <Smile className="h-8 w-8 text-pink-500" />,
      value: "98%",
      label: "Client Satisfaction",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 dark:bg-background/80 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left section */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg overflow-hidden">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  Client Portal
                </span>
              </div>
              <div className="hidden md:flex space-x-6">
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors dark:text-gray-400 dark:hover:text-white"
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="text-muted-foreground hover:text-foreground transition-colors dark:text-gray-400 dark:hover:text-white"
                >
                  Testimonials
                </a>
                <a
                  href="#contact"
                  className="text-muted-foreground hover:text-foreground transition-colors dark:text-gray-400 dark:hover:text-white"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDark((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                title="Toggle Dark Mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                )}
              </button>

              <Button
                variant="default"
                className="text-white bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  (window.location.href =
                    "https://proven-narwhal-37.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A8080%2F")
                }
              >
                Log in
              </Button>
              <Button
                variant="secondary"
                className="text-gray-900 dark:text-white hover:text-foreground"
                onClick={() =>
                  (window.location.href =
                    "https://proven-narwhal-37.accounts.dev/sign-up?redirect_url=http%3A%2F%2Flocalhost%3A8080%2F")
                }
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Manage clients and projects
              <br />
              <span className="text-primary">all in one place</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Stop juggling between Gmail, Trello, WhatsApp, Google Drive, and
              Excel. Client Portal brings everything freelancers and agencies
              need into one seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3">
                Start free trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <Play className="mr-2 h-5 w-5" />
                Watch demo
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="bg-card rounded-2xl shadow-2xl border overflow-hidden">
              <div className="bg-muted/50 px-6 py-4 border-b flex items-center space-x-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-sm text-muted-foreground">
                  clientportal.app
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Projects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        +3 this month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Clients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">28</div>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        +5 this month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$18,500</div>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        +12% this month
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">
                          Invoice #1234 paid by Acme Corp
                        </span>
                        <Badge variant="secondary" className="ml-auto">
                          2m ago
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">
                          New message from John Doe
                        </span>
                        <Badge variant="secondary" className="ml-auto">
                          5m ago
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">
                          Project "Website Redesign" updated
                        </span>
                        <Badge variant="secondary" className="ml-auto">
                          10m ago
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stop juggling multiple tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Freelancers and agencies face scattered workflows that hurt
              productivity and professionalism.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              // Map for 4 cards with icons and text
              {
                icon: <Mail className="h-12 w-12 text-red-500 mx-auto mb-4" />,
                title: "Scattered Communication",
                desc: "Email, WhatsApp, Slack - messages get lost",
              },
              {
                icon: (
                  <CreditCard className="h-12 w-12 text-red-500 mx-auto mb-4" />
                ),
                title: "Invoice Chaos",
                desc: "Excel sheets and manual tracking",
              },
              {
                icon: (
                  <FolderOpen className="h-12 w-12 text-red-500 mx-auto mb-4" />
                ),
                title: "File Chaos",
                desc: "Google Drive folders everywhere",
              },
              {
                icon: (
                  <BarChart3 className="h-12 w-12 text-red-500 mx-auto mb-4" />
                ),
                title: "No Progress Tracking",
                desc: "Clients constantly asking for updates",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
              >
                <Card className="text-center border-dashed border-2">
                  <CardContent className="p-6">
                    {item.icon}
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-4">There's a better way</h3>
            <p className="text-lg text-muted-foreground">
              One platform that combines everything you need to manage clients
              professionally.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Key Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need in one place
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Give your clients a professional experience while simplifying your
              workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Client Login Portal</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Give each client their own secure dashboard to view project
                status, messages, files, and invoices. No more "what's the
                update?" emails.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Secure client authentication</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Project-specific access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Mobile-friendly interface</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground">
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5" />
                    <span>Client Dashboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Website Redesign</span>
                      <Badge>In Progress</Badge>
                    </div>
                    <Progress value={75} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      75% complete • Due: Dec 15, 2024
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span>Project Chat</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3 flex-1">
                        <p className="text-sm">
                          The new mockups look great! When can we expect the
                          first draft?
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          2:30 PM
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3 justify-end">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[70%]">
                        <p className="text-sm">
                          Thanks! I'll have the first draft ready by Thursday.
                        </p>
                        <p className="text-xs opacity-80 mt-1">2:32 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time Chat System</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Keep all project communication in one place. No more switching
                between email, WhatsApp, and Slack. Everything is organized by
                project.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Project-based conversations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>File sharing in chat</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Email notifications</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure File Upload</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Share documents, assets, and deliverables securely. Clients can
                upload requirements and you can share final files - all
                organized by project.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Drag & drop file upload</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Version control</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Access permissions</span>
                </li>
              </ul>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <span>Project Files</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 text-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium">Brand Guidelines.pdf</p>
                      <p className="text-sm text-muted-foreground">
                        2.4 MB • Uploaded today
                      </p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">Logo_v2.png</p>
                      <p className="text-sm text-muted-foreground">
                        1.2 MB • 2 days ago
                      </p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span>Invoice Tracker</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Invoice #1234</p>
                        <p className="text-sm text-muted-foreground">
                          Acme Corp • $2,500
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Paid
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Invoice #1235</p>
                        <p className="text-sm text-muted-foreground">
                          Tech Startup • $1,800
                        </p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Invoice #1236</p>
                        <p className="text-sm text-muted-foreground">
                          Design Co • $3,200
                        </p>
                      </div>
                      <Badge variant="secondary">Draft</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Invoice Tracking</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Generate professional invoices, send them to clients, and track
                payments. No more Excel sheets or manual follow-ups.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Professional invoice templates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Automatic payment reminders</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Payment status tracking</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Project Progress Tracking
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Visual progress indicators and milestones that clients can see
                in real-time. No more "how far along are we?" questions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Visual progress bars</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Milestone tracking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Timeline views</span>
                </li>
              </ul>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Project Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Discovery & Research</p>
                        <Progress value={100} className="h-2 mt-1" />
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Design & Mockups</p>
                        <Progress value={75} className="h-2 mt-1" />
                      </div>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Development</p>
                        <Progress value={0} className="h-2 mt-1" />
                      </div>
                      <span className="text-sm text-muted-foreground">0%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by freelancers and agencies
            </h2>
            <p className="text-xl text-muted-foreground">
              See how Client Portal is transforming businesses worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Client Portal eliminated the chaos of managing 15+ clients across different tools. My clients love the transparency and I save 5 hours per week.",
                name: "Sarah Chen",
                title: "Freelance Designer",
                fallback: "SC",
              },
              {
                quote:
                  "The client portal feature alone has made us look so much more professional. We've closed 30% more deals since implementing it.",
                name: "Marcus Johnson",
                title: "Digital Agency Owner",
                fallback: "MJ",
              },
              {
                quote:
                  "Finally, one place for everything! No more digging through emails or WhatsApp to find client files. Game changer.",
                name: "Emily Rodriguez",
                title: "Marketing Consultant",
                fallback: "EL",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={testimonialVariants}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{`"${t.quote}"`}</p>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{t.fallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by professionals worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              We’ve helped thousands of businesses streamline their workflows
              and deliver better client experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white dark:bg-background rounded-xl shadow-sm border p-6 text-center hover:shadow-md transition-all"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to streamline your client management?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of freelancers and agencies who've made the switch.
            Start your free trial today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start free trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 border-white/20 hover:bg-white/10"
            >
              Schedule demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-semibold">Client Portal</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Streamline your client management with one powerful platform.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-center text-muted-foreground">
              © 2024 Client Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
