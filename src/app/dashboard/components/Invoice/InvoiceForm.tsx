import AppModal from "@/components/Modal/AppModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Trash2 } from "lucide-react";

const invoiceSchema = z
  .object({
    customer: z.string().min(1, "Customer name is required"),
    date: z.string().min(1, "Invoice date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    description: z.string().optional(),
    items: z
      .array(
        z.object({
          item: z.string().min(1, "Item name is required"),
          qty: z.number().min(1, "Quantity must be at least 1"),
          price: z.number().min(0.01, "Price must be greater than 0"),
        })
      )
      .min(1, "At least one item is required"),
  })
  .refine(
    (data) => {
      const dateObj = new Date(data.date);
      const dueObj = new Date(data.dueDate);
      return dueObj >= dateObj;
    },
    {
      message: "Due date cannot be earlier than invoice date",
      path: ["dueDate"],
    }
  );

export type InvoiceFormData = z.infer<typeof invoiceSchema>;


interface TInvoiceForm {
  buttonName: string;
  onSubmit: (data: InvoiceFormData) => void;
}

const InvoiceForm: React.FC<TInvoiceForm> = ({ buttonName, onSubmit }) => {
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customer: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      description: "",
      items: [{ item: "", qty: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleFormSubmit = () => {
    form.handleSubmit((data) => {
      onSubmit(data);
      form.reset();
    })();
  };

  return (
    <AppModal
      buttonName={buttonName}
      modalDesc="Create your invoice here. Click save when you're done."
      modalTitle="Create Invoice"
      onClick={handleFormSubmit}
    >
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="customer"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label>
                  Customer <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter customer name"
                  {...field}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label>
                  Invoice Date <span className="text-red-500">*</span>
                </Label>
                <Input type="date" {...field} />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="dueDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label>
                  Due Date <span className="text-red-500">*</span>
                </Label>
                <Input type="date" {...field} />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  type="text"
                  placeholder="Optional description"
                  {...field}
                />
                {fieldState.error && (
                  <p className="text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Invoice Items Section */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Invoice Items
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ item: "", qty: 1, price: 0 })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="grid grid-cols-12 gap-3">
                  <Controller
                    name={`items.${index}.item`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="col-span-5 space-y-1">
                        <Label className="text-xs">Item Name</Label>
                        <Input
                          type="text"
                          placeholder="Item description"
                          className="h-9 text-sm"
                          {...field}
                        />
                        {fieldState.error && (
                          <p className="text-xs text-red-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name={`items.${index}.qty`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="col-span-2 space-y-1">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          className="h-9 text-sm"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        {fieldState.error && (
                          <p className="text-xs text-red-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name={`items.${index}.price`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="col-span-3 space-y-1">
                        <Label className="text-xs">Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className="h-9 text-sm"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        {fieldState.error && (
                          <p className="text-xs text-red-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <div className="col-span-2 flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="w-full h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {form.formState.errors.items && (
            <p className="text-sm text-red-500 mt-2">
              {form.formState.errors.items.message}
            </p>
          )}
        </div>

      </div>
    </AppModal>
  );
};

export default InvoiceForm;
