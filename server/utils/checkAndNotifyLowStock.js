import Ingredient from "../models/ingredient.model.js";
import sendEmail from "./sendEmail.js";
import { ADMIN_EMAIL } from "../config/env.js";

export const checkAndNotifyLowStock = async () => {
  const lowStockIngredients = await Ingredient.find({
    stock: { $lte: 20 },
    threshold: { $gte: 0 },
    isAvailable: true,
    isDeleted: false,
  });

  const filtered = lowStockIngredients.filter(
    (i) => i.stock <= i.threshold
  );
  if (filtered.length === 0) return;

  const rows = filtered
    .map(
      (ing) =>
        `<tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${ing.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${ing.type}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align:center;">${ing.stock}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>⚠️ Low Stock Alert - Pizza Ingredients</h2>
      <p>The following ingredients are running low on stock:</p>
      <table style="border-collapse: collapse; width: 100%; margin-top: 16px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd;">Ingredient</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Type</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Remaining</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <p style="margin-top: 20px;">Please restock them as soon as possible.</p>
    </div>
  `;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: 'Low Stock Alert - Pizza Ingredients',
    html,
  });
};