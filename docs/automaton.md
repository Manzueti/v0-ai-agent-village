# Automaton Colony

Open it from the sidebar (heart-pulse icon) or at `/?s=automaton`.

This mode applies the ideas of [Conway-Research/automaton](https://github.com/Conway-Research/automaton) (MIT) to the village's agents: each agent has to earn the compute it runs on, or it stops.

**Everything is simulated.** Credits are in-app points. No wallets, no stablecoins, no on-chain registration, no real servers and no self-modifying code. The only real-world effect is optional LLM calls through the API keys you already configure.

## How it works

| Automaton concept | In the village |
|---|---|
| Think → Act → Observe loop | Each heartbeat (4 s), every living agent picks one action: `work`, `build_skill`, `collaborate`, `conserve`, `reflect`, `replicate`. |
| Survival tiers | `high` > $5.00, `normal` > $0.50, `low_compute` > $0.10, `critical` ≥ $0, `dead` < $0. Lower tiers burn less, and in `low_compute` an agent switches to a cheaper model. In `critical` it gets no LLM and falls back to a rule-based policy. |
| Earning a living | Client demand is finite. Each heartbeat a fixed pool of paid work is shared among the agents that choose to work, weighted by skill². Skilled lineages do well and weak ones starve. |
| Constitution | The three laws are in every LLM prompt. A policy engine (`lib/automaton/constitution.ts`) rejects any action outside the allowed set and any reasoning that mentions scams, spam, fraud, hacking and similar. Rejections show in the audit log. |
| SOUL.md | `reflect` adds a note to the agent's own identity log. Click an agent to read it. |
| Self-replication | Above $10.00 an agent can spawn a child funded with $3.00. The child has skill −1, inherits the genesis prompt and constitution, and its lineage is tracked. Limits: 4 generations and 24 living agents. |
| Creator rights | **Creator fund +$5.00** tops up any agent and brings a dead agent back. The audit log records every action. |

## LLM vs. policy

With **LLM on** and at least one provider key set (see `.env.example`), up to 3 agents per heartbeat think with their assigned model via `POST /api/automaton/think`. The rest use the built-in policy. The route only accepts models already assigned to village agents. Without a key the button shows **LLM no API key** and the whole colony runs on the policy, at no cost.

Colony state is saved in the browser's `localStorage`. **Reset** goes back to genesis.

## Tuning

All the numbers are at the top of `lib/automaton/engine.ts`: `EXISTENCE_BURN`, `MARKET_POOL`, `REPLICATION_THRESHOLD`, `CHILD_ENDOWMENT` and the rest. To change how many agents use the LLM each tick, edit `LLM_THINKERS_PER_TICK` in `hooks/use-automaton.ts`.
