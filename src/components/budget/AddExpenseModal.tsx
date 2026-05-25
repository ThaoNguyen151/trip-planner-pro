"use client";

import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getBudgetAlertStatus } from "@/stores";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../ui/input";
import { useBudgetStore } from "@/stores";
import type { Expense, CategoryType } from "@/types";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";

const formatDisplayMoney = (value: string | number | undefined): string => {
  if (value === undefined || value === null || value === "") return "";
  const numericString = String(value).replace(/\D/g, "");
  if (!numericString) return "";
  return new Intl.NumberFormat("de-DE").format(Number(numericString));
};

const parseDisplayMoney = (value: string): number => {
  const rawValue = value.replace(/\./g, "");
  return rawValue === "" ? 0 : Number(rawValue);
};

const expenseItemSchema = z
  .object({
    category: z.string().min(1, "Category is required"),
    name: z.string().min(3, "Item name is required"),
    estimatedCost: z
      .union([z.string(), z.number()])
      .transform((val) =>
        val === "" || val === undefined || val === null
          ? 0
          : Number(String(val).replace(/\./g, "")),
      )
      .pipe(z.number().min(1000, "Estimated cost is required")),
    actualCost: z
      .union([z.string(), z.number()])
      .transform((val) =>
        val === "" || val === undefined || val === null
          ? 0
          : Number(String(val).replace(/\./g, "")),
      ),
    paymentStatus: z.enum(["Unpaid", "Paid"]).default("Paid"),
  })
  .superRefine((data, ctx) => {
    if (data.paymentStatus === "Paid" && data.actualCost < 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Actual cost is required",
        path: ["actualCost"],
      });
    }
  });

const formSchema = z.object({
  items: z.array(expenseItemSchema),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const storeState = useBudgetStore();
  const addExpenses = useBudgetStore((state) => state.addExpenses);

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [
        {
          category: "",
          name: "",
          estimatedCost: 0,
          actualCost: 0,
          paymentStatus: "Paid",
        },
      ],
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        items: [
          {
            category: "",
            name: "",
            estimatedCost: 0,
            actualCost: 0,
            paymentStatus: "Paid",
          },
        ],
      });
    }
  }, [isOpen, form]);

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const onSubmit: SubmitHandler<FormInput> = (values) => {
    const data = values as FormOutput;
    const formattedExpenses: Expense[] = data.items.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
      category: item.category as CategoryType,
      estimatedCost: item.estimatedCost,
      actualCost: item.actualCost,
      paymentStatus: item.paymentStatus,
    }));

    addExpenses(formattedExpenses);

    form.reset({
      items: [
        {
          category: "",
          name: "",
          estimatedCost: 0,
          actualCost: 0,
          paymentStatus: "Paid",
        },
      ],
    });
    onClose();
  };

  const watchedItems = form.watch("items") || [];

  const incomingEstimated = watchedItems.reduce((sum, item) => {
    const val = item?.estimatedCost;
    const num =
      typeof val === "string" ? parseDisplayMoney(val) : Number(val || 0);
    return sum + num;
  }, 0);

  const incomingActual = watchedItems.reduce((sum, item) => {
    const val = item?.actualCost;
    const num =
      typeof val === "string" ? parseDisplayMoney(val) : Number(val || 0);
    return sum + num;
  }, 0);

  const {
    isOverBudget,
    isEstimatedOver,
    isActualOver,
    estimatedPercent,
    actualPercent,
  } = getBudgetAlertStatus(storeState, {
    newEstimated: incomingEstimated,
    newActual: incomingActual,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto no-scrollbar p-0 rounded-[18px] border-none shadow-2xl bg-card [&>button]:hidden">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-semibold tracking-tight text-primary">
                  {fields.length > 1 ? "Add New Expenses" : "Add New Expense"}
                </DialogTitle>
                {fields.length > 1 && (
                  <DialogDescription className="text-slate-500">
                    Add one or more items to your trip budget
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-10">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 relative">
                    {fields.length > 1 && (
                      <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                        <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest">
                          Item #{index + 1}
                        </span>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-slate-400 hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name={`items.${index}.category`}
                      render={({ field: selectField }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-primary">
                            Category
                          </FormLabel>
                          <Select
                            onValueChange={selectField.onChange}
                            defaultValue={selectField.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-card text-foreground">
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Food">Food</SelectItem>
                              <SelectItem value="Accommodation">
                                Accommodation
                              </SelectItem>
                              <SelectItem value="Transport">
                                Transport
                              </SelectItem>
                              <SelectItem value="Shopping">Shopping</SelectItem>
                              <SelectItem value="Activity">Activity</SelectItem>
                              <SelectItem value="Others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field: nameField }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-primary">
                            Item Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Airport Transfer"
                              className="h-12 text-foreground bg-card focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-1"
                              {...nameField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.estimatedCost`}
                        render={({ field: estField }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-primary">
                              Estimated Cost
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="0đ"
                                className="h-12 bg-card text-foreground focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-1"
                                value={formatDisplayMoney(estField.value)}
                                onChange={(e) => {
                                  const raw = parseDisplayMoney(e.target.value);
                                  estField.onChange(raw === 0 ? "" : raw);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.actualCost`}
                        render={({ field: actField }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-primary">
                              Actual Cost
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="0đ"
                                className="h-12 bg-card text-foreground focus-visible:border-primary focus-visible:ring-primary focus-visible:ring-1"
                                value={formatDisplayMoney(actField.value)}
                                onChange={(e) => {
                                  const raw = parseDisplayMoney(e.target.value);
                                  actField.onChange(raw === 0 ? "" : raw);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`items.${index}.paymentStatus`}
                      render={({ field: statusField }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-bold text-primary bg-card">
                            Payment Status
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={statusField.onChange}
                              defaultValue={statusField.value}
                              className="flex gap-20"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Unpaid"
                                  id={`unpaid-${index}`}
                                />
                                <label
                                  htmlFor={`unpaid-${index}`}
                                  className="text-sm font-medium text-foreground cursor-pointer"
                                >
                                  Unpaid
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Paid"
                                  id={`paid-${index}`}
                                />
                                <label
                                  htmlFor={`paid-${index}`}
                                  className="text-sm font-medium text-foreground cursor-pointer"
                                >
                                  Paid
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      category: "",
                      name: "",
                      estimatedCost: 0,
                      actualCost: 0,
                      paymentStatus: "Paid",
                    })
                  }
                  className="w-full py-8 border-dashed border-2 border-border/70 bg-card text-foreground hover:text-primary hover:bg-primary/20 hover:border-border transition-all gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Expense
                </Button>
              </div>
            </div>

            {isOverBudget && (
              <div className="px-8 pb-4">
                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200 text-red-950 animate-in fade-in-50"
                >
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <AlertTitle className="font-bold text-destructive">
                    Critical Alert!
                  </AlertTitle>
                  <AlertDescription className="text-xs text-red-800 font-medium space-y-1">
                    {isEstimatedOver && (
                      <p>
                        • Total estimated cost is {estimatedPercent}% over
                        budget.
                      </p>
                    )}
                    {isActualOver && (
                      <p>
                        • Total actual cost is {actualPercent}% over budget.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <DialogFooter className="bg-transparent px-4 pb-5 pt-0 border-t-0 sm:px-6 sm:pb-6">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 transition-all"
              >
                <Plus className="size-4" />
                {fields.length > 1 ? "Add Expenses" : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
