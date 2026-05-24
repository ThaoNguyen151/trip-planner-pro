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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "../ui/input";
import { useBudgetStore } from "@/stores";
import type { Expense, CategoryType } from "@/types";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";

// Zod validation schema
const expenseItemSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(3, "Item name is required"),
  estimatedCost: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().min(0, "Cost must be larger than 0")),
  actualCost: z
    .union([z.string(), z.number()])
    .transform((val) =>
      val === "" || val === undefined || val === null ? 0 : Number(val),
    )
    .pipe(z.number().min(0))
    .default(0),
  paymentStatus: z.enum(["Unpaid", "Paid"]).default("Paid"),
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
      id: crypto.randomUUID() as string,
      category: item.category as CategoryType,
      estimatedCost: item.estimatedCost,
      actualCost: item.actualCost,
      paymentStatus: item.paymentStatus as "Paid" | "Unpaid",
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto no-scrollbar p-0 rounded-[24px] border-none shadow-2xl bg-white">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold text-slate-900">
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
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Item #{index + 1}
                        </span>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.category` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">
                            Category
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-slate-50/50 text-slate-900">
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

                    {/* Item name */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">
                            Item Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Airport Transfer"
                              className="h-12 bg-slate-50/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Costs */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.estimatedCost`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-slate-700">
                              Estimated Cost
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="$0.00"
                                className="h-12 bg-slate-50/50"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.actualCost`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-bold text-slate-700">
                              Actual Cost
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="$0.00"
                                className="h-12 bg-slate-50/50"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Status */}
                    <FormField
                      control={form.control}
                      name={`items.${index}.paymentStatus`}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-bold text-slate-700">
                            Payment Status
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-20"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="Unpaid"
                                  id={`unpaid-${index}`}
                                />
                                <label
                                  htmlFor={`unpaid-${index}`}
                                  className="text-sm font-medium text-slate-600 cursor-pointer"
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
                                  className="text-sm font-medium text-slate-600 cursor-pointer"
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

                {/* Add Another Button */}
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
                  className="w-full py-8 border-dashed border-2 border-blue-200 bg-white text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Expense
                </Button>
              </div>
            </div>

            {/* Sticky footer */}
            <DialogFooter className="bg-slate-50 p-8 flex flex-row gap-4 border-t rounded-b-3xl">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 h-12 font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 font-bold bg-blue-600 hover:bg-blue-900 text-white rounded-xl shadow-lg shadow-blue-900/20 transition-all"
              >
                {fields.length > 1 ? "Save All Expenses" : "Save Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
