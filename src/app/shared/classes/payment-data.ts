export class PaymentData {
    merchant_id?: string;
    merchant_key?: string;
    return_url?: string;
    cancel_url?: string;
    notify_url?: string;
    // Buyer details
    name_first?: string;
    name_last?: string;
    email_address?: string;
    cell_number?: string;
    // Transaction details
    m_payment_id?: string;
    amount?: string;
    item_name?: string;
    email_confirmation?: string;
    confirmation_address?: string;
    signature?: string;
}
