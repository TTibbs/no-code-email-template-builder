"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { EmailTemplate } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  saveTemplatesToStorage,
  getTemplatesFromStorage,
} from "@/lib/template-utils";

// Template category type
type Category =
  | "all"
  | "newsletter"
  | "promotional"
  | "transactional"
  | "announcement";

// Predefined templates with consistent IDs
const predefinedTemplates = [
  {
    id: 1001,
    name: "Welcome Email",
    description: "A friendly welcome email for new subscribers or customers.",
    category: "transactional",
    thumbnail: "/templates/welcome-email.jpg",
    isNew: true,
    subject: "Welcome to our service",
    content: [
      {
        id: 1,
        type: "header",
        value: "Welcome to our service",
        align: "center",
        color: "#333333",
      },
      {
        id: 2,
        type: "text",
        value:
          "We're glad to have you on board! Here's what you need to know to get started.",
        align: "left",
        color: "#666666",
      },
      {
        id: 3,
        type: "button",
        value: "Get Started",
        link: "#",
        align: "center",
        color: "#ffffff",
        bgColor: "#4F46E5",
      },
    ],
  },
  {
    id: 1002,
    name: "Monthly Newsletter",
    description:
      "Clean and modern newsletter template with multiple content sections.",
    category: "newsletter",
    thumbnail: "/templates/monthly-newsletter.jpg",
    subject: "Your Monthly Newsletter",
    content: [
      {
        id: 1,
        type: "header",
        value: "Monthly Newsletter",
        align: "center",
        color: "#333333",
      },
      {
        id: 2,
        type: "text",
        value: "Here's what's new this month.",
        align: "left",
        color: "#666666",
      },
    ],
  },
  {
    id: 1003,
    name: "Product Announcement",
    description:
      "Announce your new product or feature with this eye-catching template.",
    category: "announcement",
    thumbnail: "/templates/product-announcement.jpg",
    isPremium: true,
    subject: "Introducing Our New Product",
    content: [
      {
        id: 1,
        type: "header",
        value: "Introducing Our New Product",
        align: "center",
        color: "#333333",
      },
      {
        id: 2,
        type: "text",
        value:
          "We're excited to announce our latest product that will revolutionize your workflow.",
        align: "left",
        color: "#666666",
      },
    ],
  },
  {
    id: 1004,
    name: "Special Offer",
    description:
      "Promote your special offers and discounts with this conversion-focused template.",
    category: "promotional",
    thumbnail: "/templates/special-offer.jpg",
    subject: "Special Offer Just For You",
    content: [
      {
        id: 1,
        type: "header",
        value: "Special Offer",
        align: "center",
        color: "#333333",
      },
      {
        id: 2,
        type: "text",
        value: "Limited time offer! Take advantage of these special discounts.",
        align: "left",
        color: "#666666",
      },
    ],
  },
  {
    id: 1005,
    name: "Event Invitation",
    description:
      "Invite your subscribers to your upcoming event with this elegant template.",
    category: "announcement",
    thumbnail: "/templates/event-invitation.jpg",
    subject: "You're Invited!",
    content: [
      {
        id: 1,
        type: "header",
        value: "You're Invited!",
        align: "center",
        color: "#333333",
      },
      {
        id: 2,
        type: "text",
        value: "Join us for an exclusive event you won't want to miss.",
        align: "left",
        color: "#666666",
      },
    ],
  },
  {
    id: 1006,
    name: "Thank You Email",
    description:
      "Express gratitude to your customers after a purchase or interaction.",
    category: "transactional",
    thumbnail: "/templates/thank-you.jpg",
    subject: "Thank You For Your Purchase",
    content: [
      {
        id: 1,
        type: "header",
        value: "Thank You!",
        align: "center",
        color: "#333333",
      },
      {
        id: 2,
        type: "text",
        value:
          "We appreciate your business and look forward to serving you again.",
        align: "left",
        color: "#666666",
      },
    ],
  },
  {
    id: 1007,
    name: "Feedback Request",
    description:
      "Ask for customer feedback with this simple and effective template.",
    category: "transactional",
    thumbnail: "/templates/feedback-request.jpg",
    isNew: true,
    subject: "We Value Your Feedback",
    content: [
      {
        id: 1,
        type: "header",
        value: "We Value Your Feedback",
        align: "center",
        color: "#333333",
      },
      {
        id: 2,
        type: "text",
        value:
          "Please take a moment to share your thoughts on your recent experience with us.",
        align: "left",
        color: "#666666",
      },
    ],
  },
  {
    id: 1008,
    name: "Seasonal Promotion",
    description:
      "Highlight seasonal offers with this festive and engaging template.",
    category: "promotional",
    thumbnail: "/templates/seasonal-promotion.jpg",
    subject: "Seasonal Offers Inside!",
    content: [
      {
        id: 1,
        type: "header",
        value: "Seasonal Promotion",
        align: "center",
        color: "#333333",
      },
      {
        id: 2,
        type: "text",
        value: "Check out our special seasonal offers before they're gone!",
        align: "left",
        color: "#666666",
      },
    ],
  },
];

// Interface for display templates
interface DisplayTemplate {
  id: number;
  name: string;
  description: string;
  category: Category;
  thumbnail: string;
  isNew?: boolean;
  isPremium?: boolean;
}

export default function TemplateGallery() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize templates in local storage and simulate loading
  useEffect(() => {
    const storedTemplates = getTemplatesFromStorage();

    // If no templates exist in storage, initialize with predefined templates
    if (storedTemplates.length === 0) {
      saveTemplatesToStorage(predefinedTemplates as EmailTemplate[]);
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Convert predefined templates to display templates
  const displayTemplates: DisplayTemplate[] = predefinedTemplates.map(
    (template) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category as Category,
      thumbnail: template.thumbnail,
      isNew: template.isNew,
      isPremium: template.isPremium,
    })
  );

  // Filter templates based on search query and selected category
  const filteredTemplates = displayTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle template selection - create a copy for the user
  const handleTemplateSelect = (templateId: number) => {
    // Find the template in predefined templates
    const selectedTemplate = predefinedTemplates.find(
      (t) => t.id === templateId
    );

    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Template not found",
        variant: "destructive",
      });
      return;
    }

    // Create a new template based on the selected one with a unique ID
    const userTemplate: EmailTemplate = {
      id: Date.now(), // Generate a unique ID
      name: `${selectedTemplate.name} (My Copy)`,
      subject: selectedTemplate.subject,
      content: selectedTemplate.content.map((component) => ({
        ...component,
        // Ensure align property is one of the allowed values
        align: component.align as "left" | "center" | "right" | undefined,
      })),
    };

    // Save the new template to local storage
    const existingTemplates = getTemplatesFromStorage();
    saveTemplatesToStorage([...existingTemplates, userTemplate]);

    // Show success message
    toast({
      title: "Success",
      description: "Template copied to your collection",
    });

    // Redirect to edit the new template
    router.push(`/templates/${userTemplate.id}`);
  };

  // Skeleton loader for the gallery
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="mr-4 h-5 w-5 bg-zinc-800 rounded-full"></div>
              <div className="h-8 w-48 bg-zinc-800 rounded"></div>
            </div>
          </div>

          {/* Search and Filter Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className="h-10 bg-zinc-800 rounded-lg w-full"></div>
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              <div className="h-6 w-16 bg-zinc-800 rounded-full"></div>
              <div className="h-6 w-24 bg-zinc-800 rounded-full"></div>
              <div className="h-6 w-24 bg-zinc-800 rounded-full"></div>
              <div className="h-6 w-24 bg-zinc-800 rounded-full"></div>
              <div className="h-6 w-24 bg-zinc-800 rounded-full"></div>
            </div>
          </div>

          {/* Templates Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 animate-pulse"
              >
                <div className="h-48 bg-zinc-700"></div>
                <div className="p-4">
                  <div className="h-5 bg-zinc-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-full mb-1"></div>
                  <div className="h-4 bg-zinc-700 rounded w-2/3 mb-3"></div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="h-4 w-20 bg-zinc-700 rounded-full"></div>
                    <div className="h-4 w-24 bg-zinc-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/templates" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-zinc-400 hover:text-white transition-colors" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Template Gallery
            </h1>
          </div>
          {/* Create New button removed as requested */}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center text-zinc-400 mr-2">
              <Filter className="h-4 w-4 mr-1" />
              <span>Filter:</span>
            </div>
            {(
              [
                "all",
                "newsletter",
                "promotional",
                "transactional",
                "announcement",
              ] as Category[]
            ).map((category) => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className="group bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-emerald-500 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-48 bg-zinc-700 overflow-hidden">
                  {/* This would be an actual image in production */}
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-500 group-hover:scale-105 transition-transform duration-300">
                    {template.name}
                  </div>
                  {template.isNew && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </div>
                  )}
                  {template.isPremium && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                      Premium
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white mb-1">
                    {template.name}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-2">
                    {template.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-zinc-700 rounded-full text-zinc-300">
                      {template.category.charAt(0).toUpperCase() +
                        template.category.slice(1)}
                    </span>
                    <span className="text-xs text-emerald-500 font-medium">
                      Use Template
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">
              No templates found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 text-emerald-500 hover:text-emerald-400"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
