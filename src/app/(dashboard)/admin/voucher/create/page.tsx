"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Coins,
  CreditCard,
  Percent,
  RefreshCw,
  Tag,
  Ticket,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import BreadcrumbGroup from "@/components/breadcrumb";
import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateVoucher } from "../hooks/use-create-voucher";

const BREADCRUMBS = [
  { name: "Dashboard", href: "/admin" },
  { name: "Voucher Management", href: "/admin/voucher" },
  { name: "Create Voucher", href: "/admin/voucher/create" },
];

const voucherSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["fixed_amount", "percentage"]),
  amount: z.number().min(1, "Amount must be greater than 0"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  usage_limit: z.number().min(1, "Usage limit must be at least 1"),
  start_date: z.string().min(1, "Start date is required"),
  expiry_date: z.string().min(1, "Expiry date is required"),
  status: z.enum(["active", "inactive", "expired"]),
});

type VoucherFormData = z.infer<typeof voucherSchema>;

export default function CreateVoucherPage() {
  const router = useRouter();
  const { mutate: createVoucher, isPending: isSubmitting } = useCreateVoucher();

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      type: "fixed_amount",
      amount: 0,
      quantity: 100,
      usage_limit: 1,
      start_date: "",
      expiry_date: "",
      status: "active",
    },
  });

  // Real-time values for preview
  const watchedValues = form.watch();

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue("code", result);
  };

  const onSubmit = (data: VoucherFormData) => {
    createVoucher(data, {
      onSuccess: () => {
        router.push("/admin/voucher");
      },
    });
  };

  return (
    <div className="flex flex-col space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start max-lg:justify-start">
        <div>
          <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
            Create New Voucher
          </Typography>
          <Typography variant="p" className="text-gray-500 mt-1">
            Design and configure a new voucher for your marketing campaigns.
          </Typography>
        </div>
        <BreadcrumbGroup items={BREADCRUMBS} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Card 1: Basic Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    Voucher Details
                  </CardTitle>
                  <CardDescription>
                    Essential information about the voucher.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voucher Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                placeholder="e.g. New Year Sale"
                                className="pl-9"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voucher Code</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                  placeholder="e.g. SALE2025"
                                  className="pl-9 uppercase"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.value.toUpperCase())
                                  }
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={generateCode}
                                className="px-3"
                                title="Generate Random Code"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Must be unique and at least 3 chars.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Briefly describe what this voucher offers..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Card 2: Value & Limits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-primary" />
                    Value & Limits
                  </CardTitle>
                  <CardDescription>
                    Define the discount value and usage constraints.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block">Discount Type</FormLabel>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => field.onChange("fixed_amount")}
                              className={cn(
                                "flex flex-1 flex-col items-center justify-center rounded-xl border-2 p-4 transition-all hover:bg-gray-50",
                                field.value === "fixed_amount"
                                  ? "border-primary bg-blue-50/50 text-primary"
                                  : "border-gray-100 text-gray-500",
                              )}
                            >
                              <Coins className="mb-2 h-6 w-6" />
                              <span className="font-medium">Fixed Amount</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => field.onChange("percentage")}
                              className={cn(
                                "flex flex-1 flex-col items-center justify-center rounded-xl border-2 p-4 transition-all hover:bg-gray-50",
                                field.value === "percentage"
                                  ? "border-primary bg-blue-50/50 text-primary"
                                  : "border-gray-100 text-gray-500",
                              )}
                            >
                              <Percent className="mb-2 h-6 w-6" />
                              <span className="font-medium">Percentage</span>
                            </button>
                          </div>
                          <input type="hidden" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {form.watch("type") === "percentage"
                              ? "Percentage Value (%)"
                              : "Amount Value (Rp)"}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-sm font-bold text-gray-500">
                                {form.watch("type") === "percentage"
                                  ? "%"
                                  : "Rp"}
                              </span>
                              <Input
                                type="number"
                                placeholder="0"
                                className="pl-9 font-mono font-medium"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Quantity</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                type="number"
                                className="pl-9"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormDescription>Global usage limit</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="usage_limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Limit Per User</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                              <Input
                                type="number"
                                className="pl-9"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Max usage per account
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Validity & Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Validity Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expiry_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                Active
                              </div>
                            </SelectItem>
                            <SelectItem value="inactive">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gray-400" />
                                Inactive
                              </div>
                            </SelectItem>
                            <SelectItem value="expired">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                Expired
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/admin/voucher")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="min-w-[150px]"
                >
                  {isSubmitting ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Ticket className="mr-2 h-4 w-4" /> Create Voucher
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <Typography variant="h3" weight="bold">
              Live Preview
            </Typography>

            {/* Ticket Preview Component */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#357182] to-[#2a5b69] text-white shadow-xl transition-all hover:scale-[1.02]">
              <div className="relative p-6">
                {/* Decorative Circles */}
                <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f8fafc]" />
                <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f8fafc]" />

                {/* Content */}
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-white/20 p-3">
                    <Ticket className="h-8 w-8 text-white" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium uppercase tracking-wider opacity-80">
                      {watchedValues.name || "Voucher Name"}
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight">
                      {watchedValues.type === "fixed_amount" ? (
                        <>
                          <span className="text-xl">Rp</span>{" "}
                          {watchedValues.amount?.toLocaleString("id-ID") ?? "0"}
                        </>
                      ) : (
                        <>{watchedValues.amount ?? "0"}% OFF</>
                      )}
                    </h2>
                  </div>

                  <div className="w-full rounded-lg border-2 border-dashed border-white/30 bg-white/10 p-3 backdrop-blur-sm">
                    <p className="font-mono text-xl font-bold tracking-widest">
                      {watchedValues.code || "CODE123"}
                    </p>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-2 text-xs opacity-80">
                    <div className="text-left">
                      <p>Valid From:</p>
                      <p className="font-semibold">
                        {watchedValues.start_date || "YYYY-MM-DD"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>Expires:</p>
                      <p className="font-semibold">
                        {watchedValues.expiry_date || "YYYY-MM-DD"}
                      </p>
                    </div>
                  </div>

                  <div className="w-full text-center">
                    <p className="text-xs opacity-80">Status:</p>
                    <Badge
                      variant="secondary"
                      className="mt-0.5 bg-white/20 text-white hover:bg-white/30"
                    >
                      {watchedValues.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Bottom Decoration */}
              <div className="border-t border-dashed border-white/20 bg-black/10 p-3 text-center text-xs opacity-70">
                {watchedValues.description || "No description provided."}
              </div>
            </div>

            {/* Quick Summary Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Supply:</span>
                  <span className="font-medium">{watchedValues.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">User Limit:</span>
                  <span className="font-medium">
                    {watchedValues.usage_limit}x
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
