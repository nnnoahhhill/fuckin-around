# Money and trust

Money movement is critical risk in Ghostline. The agent can research prices, prepare carts, compare
offers, and draft messages. It cannot spend without a fresh single-use approval.

## Policy object

`MoneyPolicy` lives on `AgentSession`:

- `currency`
- `perActionLimitCents`
- `dailyLimitCents`
- `allowedMerchantIds`
- `requiresFreshApprovalAboveCents`

The default demo policy requires fresh approval above one cent.

## Payment flow

1. Agent finds item, service, boost, subscription, or listing.
2. Agent creates `payment_authorization` intent.
3. Intent includes merchant, amount, fees, tax, delivery terms, refund terms, and expected result.
4. User approves exactly one payment.
5. Payment executor runs once.
6. Receipt evidence is attached.

## Marketplace flow

Reading listings is low risk. Messaging sellers is medium risk and irreversible.

Required marketplace intent fields:

- selected listing id and URL;
- price;
- seller id when visible;
- exact message text;
- `maxMessages: 1`;
- delivery or pickup constraints when relevant.

## Spending controls

- per-action limits;
- daily limits;
- merchant allowlist;
- fresh approval for every payment;
- receipt capture;
- card lock after failed policy validation;
- optional user PIN or hardware confirmation for critical actions.

## What the agent can do without money approval

- compare prices;
- summarize fees;
- watch listings;
- draft one seller message;
- prepare a cart;
- show payment screen;
- ask whether to proceed.
