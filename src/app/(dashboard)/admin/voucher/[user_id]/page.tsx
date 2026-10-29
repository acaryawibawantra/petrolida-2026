"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CalendarIcon,
  Coins,
  CreditCard,
  Loader2,
  Percent,
  RefreshCw,
  Tag,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
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

import { useGetVoucher } from "../hooks/use-get-voucher";
import { useUpdateVoucher } from "../hooks/use-update-voucher";

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

export default function VoucherDetailPage({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = React.use(params);
  const voucherId = user_id;
  const [isEditing, setIsEditing] = React.useState(false);

  // Hooks
  const { data: voucher, isLoading, refetch } = useGetVoucher(voucherId);
  const { mutate: updateVoucher, isPending: isSubmitting } = useUpdateVoucher();

  const BREADCRUMBS = [
    { name: "Dashboard", href: "/admin" },
    { name: "Voucher Management", href: "/admin/voucher" },
    { name: voucher?.name || "Detail", href: `/admin/voucher/${voucherId}` },
  ];

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      type: "fixed_amount",
      amount: 0,
      quantity: 0,
      usage_limit: 0,
      start_date: "",
      expiry_date: "",
      status: "active",
    },
  });

  // Load data into form when available
  React.useEffect(() => {
    if (voucher) {
      form.reset({
        code: voucher.code,
        name: voucher.name,
        description: voucher.description || "",
        type: voucher.type,
        amount: voucher.amount,
        quantity: voucher.quantity,
        usage_limit: voucher.usage_limit,
        start_date: voucher.start_date,
        expiry_date: voucher.expiry_date,
        status: voucher.status,
      });
    }
  }, [voucher, form]);

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
    updateVoucher(
      { id: voucherId, ...data },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetch();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!voucher) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between max-lg:flex-col-reverse max-lg:items-start max-lg:justify-start">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/admin/voucher">
              <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Typography variant="h1" weight="bold" className="max-xl:!text-3xl">
              Voucher Detail
            </Typography>
            <Badge
              variant={
                voucher.status === "active"
                  ? "success"
                  : voucher.status === "inactive"
                    ? "secondary"
                    : "destructive"
              }
            >
              {voucher.status}
            </Badge>
          </div>
          <Typography variant="p" className="text-gray-500 mt-1">
            View and manage specific voucher details.
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-primary" />
                      Voucher Details
                    </CardTitle>
                    <CardDescription>
                      Essential information about the voucher.
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Voucher
                    </Button>
                  )}
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
                                disabled={!isEditing}
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
                                  disabled={!isEditing}
                                  onChange={(e) =>
                                    field.onChange(e.target.value.toUpperCase())
                                  }
                                />
                              </div>
                              {isEditing && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={generateCode}
                                  className="px-3"
                                  title="Generate Random Code"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              )}
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
                            disabled={!isEditing}
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
                              disabled={!isEditing}
                              onClick={() => field.onChange("fixed_amount")}
                              className={cn(
                                "flex flex-1 flex-col items-center justify-center rounded-xl border-2 p-4 transition-all",
                                field.value === "fixed_amount"
                                  ? "border-primary bg-blue-50/50 text-primary"
                                  : "border-gray-100 text-gray-500",
                                isEditing && "hover:bg-gray-50",
                                !isEditing && "cursor-default opacity-80",
                              )}
                            >
                              <Coins className="mb-2 h-6 w-6" />
                              <span className="font-medium">Fixed Amount</span>
                            </button>
                            <button
                              type="button"
                              disabled={!isEditing}
                              onClick={() => field.onChange("percentage")}
                              className={cn(
                                "flex flex-1 flex-col items-center justify-center rounded-xl border-2 p-4 transition-all",
                                field.value === "percentage"
                                  ? "border-primary bg-blue-50/50 text-primary"
                                  : "border-gray-100 text-gray-500",
                                isEditing && "hover:bg-gray-50",
                                !isEditing && "cursor-default opacity-80",
                              )}
                            >
                              <Percent className="mb-2 h-6 w-6" />
                              <span className="font-medium">Percentage</span>
                            </button>
                          </div>
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
                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                                disabled={!isEditing}
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
                      name="expiry_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!isEditing}
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
                  </div>
                </CardContent>
              </Card>

              {/* Edit Mode Actions */}
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset({
                        code: voucher?.code,
                        name: voucher?.name,
                        description: voucher?.description || "",
                        type: voucher?.type,
                        amount: voucher?.amount,
                        quantity: voucher?.quantity,
                        usage_limit: voucher?.usage_limit,
                        expiry_date: voucher?.expiry_date,
                        status: voucher?.status,
                      });
                    }}
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
                    {isSubmitting ? <>Saving...</> : <>Save Changes</>}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>

        {/* Right Column: Live Preview & Stats */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <Typography variant="h3" weight="bold">
              Preview
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
                      <p>Expires:</p>
                      <p className="font-semibold">
                        {watchedValues.expiry_date || "YYYY-MM-DD"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>Status:</p>
                      <Badge
                        variant="secondary"
                        className="mt-0.5 bg-white/20 text-white hover:bg-white/30"
                      >
                        {watchedValues.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Decoration */}
              <div className="border-t border-dashed border-white/20 bg-black/10 p-3 text-center text-xs opacity-70">
                {watchedValues.description || "No description provided."}
              </div>
            </div>

            {/* Statistics Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-500">Usage Progress</span>
                    <span className="font-medium text-gray-900">
                      {voucher.used_count} / {voucher.quantity} used
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (voucher.used_count / voucher.quantity) * 100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <Typography variant="l" className="text-gray-500">
                      Remaining
                    </Typography>
                    <Typography variant="p" weight="bold">
                      {voucher.quantity - voucher.used_count}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="l" className="text-gray-500">
                      Used Count
                    </Typography>
                    <Typography variant="p" weight="bold">
                      {voucher.used_count}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
