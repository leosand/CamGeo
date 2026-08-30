# CamGeo Label Guide

Labels keep issues and pull requests (PRs) organized. The GitHub API tool we use cannot create labels automatically, so a repository admin creates them once, by hand or with the GitHub CLI (commands at the bottom).

## Naming convention

`namespace: value` in lowercase. Four namespaces: `type`, `status`, `wg`, `region` — plus a few standalone community labels.

## Label list

| Label | Colour | Meaning |
|---|---|---|
| `type: bug` | `#d73a4a` | Something is broken |
| `type: feature` | `#1d76db` | New code or pipeline stage |
| `type: docs` | `#0075ca` | Documentation only |
| `type: data` | `#008672` | Datasets, samples, manifests |
| `type: governance` | `#6f42c1` | Governance or process question |
| `status: needs-triage` | `#fbca04` | New, not yet reviewed by a maintainer |
| `status: in-progress` | `#0e8a16` | Someone is actively working on it |
| `status: blocked` | `#b60205` | Waiting on a decision or external factor |
| `status: needs-review` | `#f9d0c4` | Work done, waiting for review |
| `wg: data-sensors` | `#c2e0c6` | Data & Sensors working group |
| `wg: methods-ml` | `#c2e0c6` | Methods & ML working group |
| `wg: validation` | `#c2e0c6` | Validation & Local Knowledge working group |
| `wg: community` | `#c2e0c6` | Community & Outreach working group |
| `region: est` | `#8ecae6` | East region |
| `region: sud` | `#8ecae6` | South region |
| `region: adamaoua` | `#8ecae6` | Adamawa region |
| `region: littoral` | `#8ecae6` | Littoral region |
| `region: ouest` | `#8ecae6` | West region |
| `region: nord-ouest` | `#8ecae6` | Northwest region |
| `region: sud-ouest` | `#8ecae6` | Southwest region |
| `good first issue` | `#7057ff` | Perfect for newcomers (always keep a few open) |
| `help wanted` | `#008672` | Maintainers explicitly ask for help |
| `question` | `#d876e3` | Question, no code change needed |
| `rfc` | `#6f42c1` | Request for comments — Level 3 governance decision |
| `validation` | `#fbca04` | Sample labelling or map checking task |

## Create them with the GitHub CLI

Run once from a terminal (requires `gh auth login` and admin rights on the repo):

```bash
REPO=leosand/CamGeo
gh label create "type: bug"            --color d73a4a --repo $REPO
gh label create "type: feature"        --color 1d76db --repo $REPO
gh label create "type: docs"           --color 0075ca --repo $REPO
gh label create "type: data"           --color 008672 --repo $REPO
gh label create "type: governance"     --color 6f42c1 --repo $REPO
gh label create "status: needs-triage" --color fbca04 --repo $REPO
gh label create "status: in-progress"  --color 0e8a16 --repo $REPO
gh label create "status: blocked"      --color b60205 --repo $REPO
gh label create "status: needs-review" --color f9d0c4 --repo $REPO
gh label create "wg: data-sensors"     --color c2e0c6 --repo $REPO
gh label create "wg: methods-ml"       --color c2e0c6 --repo $REPO
gh label create "wg: validation"       --color c2e0c6 --repo $REPO
gh label create "wg: community"        --color c2e0c6 --repo $REPO
gh label create "region: est"          --color 8ecae6 --repo $REPO
gh label create "region: sud"          --color 8ecae6 --repo $REPO
gh label create "region: adamaoua"     --color 8ecae6 --repo $REPO
gh label create "region: littoral"     --color 8ecae6 --repo $REPO
gh label create "region: ouest"        --color 8ecae6 --repo $REPO
gh label create "region: nord-ouest"   --color 8ecae6 --repo $REPO
gh label create "region: sud-ouest"    --color 8ecae6 --repo $REPO
gh label create "good first issue"     --color 7057ff --repo $REPO
gh label create "help wanted"          --color 008672 --repo $REPO
gh label create "question"             --color d876e3 --repo $REPO
gh label create "rfc"                  --color 6f42c1 --repo $REPO
gh label create "validation"           --color fbca04 --repo $REPO
```

## Usage rules

- Every issue gets at least one `type:` label, added by the author or at triage.
- Maintainers add `status:` labels during weekly triage.
- `rfc` issues follow the Level 3 process in [../GOVERNANCE.md](../GOVERNANCE.md).
- Keep `good first issue` tasks small (under 2 hours) and well explained.
