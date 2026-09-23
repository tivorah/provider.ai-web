import { PageHeader } from "../../components/PageHeader";
import { useState } from "react";
import {
  Check,
  ChevronRight,
  Copy,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import {
  accessModules,
  accessRoles,
  defaultAccessPermissions,
} from "../../utils/content";
import { CreateRoleModal } from "./components/CreateRoleModal";

export function AccessManagement() {
  const [roles, setRoles] = useState(accessRoles),
    [selectedId, setSelectedId] = useState("manager"),
    [permissions, setPermissions] = useState(defaultAccessPermissions),
    [tab, setTab] = useState("Permissions"),
    [roleQuery, setRoleQuery] = useState(""),
    [toast, setToast] = useState(""),
    [createOpen, setCreateOpen] = useState(false);
  const role = roles.find((r) => r.id === selectedId)!;
  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };
  const toggle = (module: string) =>
    setPermissions((current) => ({
      ...current,
      [role.id]: (current[role.id] || []).includes(module)
        ? current[role.id].filter((x) => x !== module)
        : [...(current[role.id] || []), module],
    }));
  return (
    <section className="page w-full max-w-none px-[clamp(12px,1.5vw,24px)] pb-14 pt-8 text-[15px] leading-normal access-page max-w-none">
      <PageHeader category="Organisation" title="Roles and permissions" description="Control what each team member can view, manage and approve.">
        <button className="primary-button" onClick={() => setCreateOpen(true)}><Plus size={17} />Create role</button>
      </PageHeader>
      <div className="access-assurance [display:grid] [grid-template-columns:38px_1fr_auto] [gap:12px] [align-items:center] [padding:14px_17px] [margin-bottom:16px] [border:1px_solid_#d8e9fc] [border-radius:12px] [background:#f4f9ff] [&>svg]:[width:36px] [&>svg]:[height:36px] [&>svg]:[padding:8px] [&>svg]:[border-radius:9px] [&>svg]:[color:#518dd2] [&>svg]:[background:#fff] [&_strong]:[font-size:13px] [&_p]:[margin:3px_0_0] [&_p]:[color:#74718a] [&_p]:[font-size:11px] [&_button]:[border:0] [&_button]:[background:none] [&_button]:[color:#4f88ca] [&_button]:[font-size:11px] [&_button]:[font-weight:750]">
        <ShieldCheck />
        <div>
          <strong>Least-privilege access</strong>
          <p>
            Permissions combine role access with participant, branch and record
            assignments. Every change is added to the organisation audit log.
          </p>
        </div>
        <button onClick={() => notify("Access report generated.")}>
          Download access report
        </button>
      </div>
      <div className="access-layout [display:grid] [grid-template-columns:300px_minmax(0,1fr)] [min-height:680px] [border:1px_solid_#e1e3eb] [border-radius:14px] [background:#fff] [overflow:hidden] max-[1050px]:[grid-template-columns:250px_1fr] max-[760px]:[display:block]">
        <aside className="role-list [border-right:1px_solid_#e4e6ed] [padding:17px_11px] [background:#fafbfc] [&>div]:[display:flex] [&>div]:[justify-content:space-between] [&>div]:[padding:3px_8px_13px] [&>div_strong]:[font-size:13px] [&>div_small]:[color:#8b91a0] [&>div_small]:[font-size:11px] [&>label]:[height:39px] [&>label]:[margin:0_5px_12px] [&>label]:[padding:0_10px] [&>label]:[display:flex] [&>label]:[align-items:center] [&>label]:[gap:7px] [&>label]:[border:1px_solid_#dfe2ea] [&>label]:[border-radius:8px] [&>label]:[background:white] [&>label_svg]:[width:15px] [&>label_svg]:[color:#9198a8] [&_input]:[min-width:0] [&_input]:[border:0] [&_input]:[outline:0] [&_input]:[font-size:11px] [&>button]:[width:100%] [&>button]:[display:grid] [&>button]:[grid-template-columns:36px_1fr_14px] [&>button]:[gap:9px] [&>button]:[align-items:center] [&>button]:[padding:11px_9px] [&>button]:[border:1px_solid_transparent] [&>button]:[border-radius:9px] [&>button]:[background:none] [&>button]:[text-align:left] [&>button.active]:[border-color:#d8e9fc] [&>button.active]:[background:#f0f7ff] [&>button>svg]:[width:13px] [&>button>svg]:[color:#9ca2b0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:3px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] max-[760px]:[border-right:0] max-[760px]:[max-height:330px] max-[760px]:[overflow:auto]">
          <div>
            <strong>Business roles</strong>
            <small>{roles.length} active roles</small>
          </div>
          <label>
            <Search />
            <input
              value={roleQuery}
              onChange={(event) => setRoleQuery(event.target.value)}
              placeholder="Search roles…"
            />
          </label>
          {roles
            .filter((item) =>
              `${item.name} ${item.description}`
                .toLowerCase()
                .includes(roleQuery.trim().toLowerCase()),
            )
            .map((item) => (
              <button
                key={item.id}
                className={selectedId === item.id ? "active" : ""}
                onClick={() => setSelectedId(item.id)}
              >
                <span
                  className={`role-mark [width:35px] [height:35px] [border-radius:9px] [display:grid] [place-items:center] [color:#528fd5] [background:#e9f3ff] [&_svg]:[width:17px] [&.blue]:[color:#3477b8] [&.blue]:[background:#e7f2fc] [&.mint]:[color:#258064] [&.mint]:[background:#e6f7f0] [&.amber]:[color:#a86a2a] [&.amber]:[background:#fff0dc] [&.rose]:[color:#b5475b] [&.rose]:[background:#ffe7eb] [&.slate]:[color:#536077] [&.slate]:[background:#edf0f4] ${item.colour}`}
                >
                  <Users />
                </span>
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.users} people · Starts at {item.home}
                  </small>
                </span>
                <ChevronRight />
              </button>
            ))}
        </aside>
        <main className="role-detail [min-width:0] [display:flex] [flex-direction:column] [&>header]:[padding:20px_22px] [&>header]:[display:flex] [&>header]:[justify-content:space-between] [&>header]:[border-bottom:1px_solid_#e7e8ee] [&>header>div]:[display:flex] [&>header>div]:[gap:11px] [&>header_small]:[color:#77a6dc] [&>header_small]:[font-size:11px] [&>header_small]:[font-weight:800] [&>header_small]:[text-transform:uppercase] [&_h2]:[font-size:19px] [&_h2]:[margin:2px_0] [&>header_p]:[margin:0] [&>header_p]:[color:#72756d] [&>header_p]:[font-size:11px] [&>header>button]:[border:0] [&>header>button]:[background:none] [&>nav]:[display:flex] [&>nav]:[margin:0] [&>nav]:[border-bottom:1px_solid_#e4e6ed] [&>nav]:[padding:0_20px] [&>nav_button]:[width:auto] [&>nav_button]:[padding:13px_11px] [&>nav_button]:[border-radius:0] [&>nav_button]:[border-bottom:2px_solid_transparent] [&>nav_button]:[margin:0] [&>nav_button]:[color:#777e8e] [&>nav_button]:[font-size:11px] [&>nav_button.active]:[background:none] [&>nav_button.active]:[color:#4f8bd0] [&>nav_button.active]:[border-color:#5896dc] [&>nav_em]:[font-style:normal] [&>nav_em]:[margin-left:6px] [&>nav_em]:[padding:1px_5px] [&>nav_em]:[border-radius:8px] [&>nav_em]:[background:#ebf4ff] [&>footer]:[padding:13px_20px] [&>footer]:[border-top:1px_solid_#e5e6ec] [&>footer]:[display:flex] [&>footer]:[align-items:center] [&>footer]:[justify-content:space-between] [&>footer>span]:[display:flex] [&>footer>span]:[align-items:center] [&>footer>span]:[gap:6px] [&>footer>span]:[color:#838999] [&>footer>span]:[font-size:11px] [&>footer_svg]:[width:14px] max-[760px]:[&>nav]:[overflow:auto]">
          <header>
            <div>
              <span
                className={`role-mark [width:35px] [height:35px] [border-radius:9px] [display:grid] [place-items:center] [color:#528fd5] [background:#e9f3ff] [&_svg]:[width:17px] [&.blue]:[color:#3477b8] [&.blue]:[background:#e7f2fc] [&.mint]:[color:#258064] [&.mint]:[background:#e6f7f0] [&.amber]:[color:#a86a2a] [&.amber]:[background:#fff0dc] [&.rose]:[color:#b5475b] [&.rose]:[background:#ffe7eb] [&.slate]:[color:#536077] [&.slate]:[background:#edf0f4] ${role.colour}`}
              >
                <ShieldCheck />
              </span>
              <div>
                <small>Business role</small>
                <h2>{role.name}</h2>
                <p>{role.description}</p>
              </div>
            </div>
            <button>
              <MoreHorizontal />
            </button>
          </header>
          <nav>
            {[
              "Permissions",
              "Login experience",
              "Assigned people",
              "Audit history",
            ].map((item) => (
              <button
                className={tab === item ? "active" : ""}
                onClick={() => setTab(item)}
                key={item}
              >
                {item}
                {item === "Assigned people" && <em>{role.users}</em>}
              </button>
            ))}
          </nav>
          {tab === "Permissions" && (
            <div className="permission-view [padding:22px] [flex:1]">
              <div className="role-section-title [display:flex] [justify-content:space-between] [align-items:center] [margin-bottom:15px] [&_h3]:[margin:0] [&_h3]:[font-size:14px] [&_p]:[margin:4px_0_0] [&_p]:[color:#858c9b] [&_p]:[font-size:11px] [&>span]:[padding:5px_8px] [&>span]:[border-radius:8px] [&>span]:[background:#dddfd7] [&>span]:[color:#6f7585] [&>span]:[font-size:11px]">
                <div>
                  <h3>Screen access</h3>
                  <p>Choose the Provider.ai screens visible to this role.</p>
                </div>
                <span>
                  {(permissions[role.id] || []).length} of{" "}
                  {accessModules.length} enabled
                </span>
              </div>
              <div className="permission-grid [display:grid] [grid-template-columns:repeat(2,minmax(250px,1fr))] [gap:8px] [&>button]:[padding:11px] [&>button]:[display:grid] [&>button]:[grid-template-columns:20px_1fr] [&>button]:[gap:9px] [&>button]:[border:1px_solid_#e1e3ea] [&>button]:[border-radius:9px] [&>button]:[background:#fff] [&>button]:[text-align:left] [&>button.active]:[border-color:#d3e6fb] [&>button.active]:[background:#f3f3ef] [&>button>span]:[width:18px] [&>button>span]:[height:18px] [&>button>span]:[border:1px_solid_#cfd3dd] [&>button>span]:[border-radius:5px] [&>button>span]:[display:grid] [&>button>span]:[place-items:center] [&>button.active>span]:[color:white] [&>button.active>span]:[border-color:#5997dd] [&>button.active>span]:[background:#5997dd] [&_svg]:[width:11px] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:3px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] [&_small]:[line-height:1.4] max-[1050px]:[grid-template-columns:1fr] max-[760px]:[grid-template-columns:1fr]">
                {accessModules.map((module) => {
                  const active = (permissions[role.id] || []).includes(module);
                  return (
                    <button
                      className={active ? "active" : ""}
                      onClick={() => toggle(module)}
                      key={module}
                    >
                      <span>{active && <Check />}</span>
                      <div>
                        <strong>{module}</strong>
                        <small>
                          {module === "Participants"
                            ? "Assigned participant records and service information"
                            : module === "Roster"
                              ? "Published shifts, availability and shift notes"
                              : module === "Finance & claims"
                                ? "Invoices, claims and payment information"
                                : `Open and work with ${module.toLowerCase()}`}
                        </small>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="access-scope [margin-top:18px] [padding:16px] [border-radius:10px] [background:#f3f3ef] [display:grid] [grid-template-columns:1fr_1fr] [gap:10px] [&>div]:[grid-column:1/-1] [&_h3]:[margin:0] [&_h3]:[font-size:13px] [&_p]:[margin:3px_0] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&_label]:[display:flex] [&_label]:[gap:7px] [&_input]:[accent-color:#5997dd] [&_label_strong]:[display:block] [&_label_strong]:[font-size:11px] [&_label_small]:[display:block] [&_label_small]:[font-size:11px] [&_label_small]:[color:#72756d] [&_label_small]:[margin-top:2px] max-[760px]:[grid-template-columns:1fr]">
                <div>
                  <h3>Data scope</h3>
                  <p>
                    Restrict which records this role can access inside enabled
                    screens.
                  </p>
                </div>
                {[
                  "Only assigned participants",
                  "Only assigned branches",
                  "Hide participant financial values",
                  "Allow exports and downloads",
                ].map((item, index) => (
                  <label key={item}>
                    <input type="checkbox" defaultChecked={index < 2} />
                    <span>
                      <strong>{item}</strong>
                      <small>
                        {index === 0
                          ? "Workers only see participants linked to their published shifts."
                          : "Applied in addition to screen permissions."}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {tab === "Login experience" && (
            <div className="login-experience [padding:22px] [flex:1] [&_h3]:[margin:0] [&_h3]:[font-size:14px] [&>p]:[margin:4px_0_0] [&>p]:[color:#858c9b] [&>p]:[font-size:11px] [&_section]:[border-top:1px_solid_#e6e7ed] [&_section]:[padding-top:18px] [&_section_label]:[display:flex] [&_section_label]:[gap:8px] [&_section_label]:[padding:8px_0] [&_section_label]:[font-size:11px] [&_input]:[accent-color:#5997dd]">
              <h3>First screen after login</h3>
              <p>
                Choose the most useful starting point for people with this role.
              </p>
              <div className="home-options [&>button>span]:[width:18px] [&>button>span]:[height:18px] [&>button>span]:[border:1px_solid_#cfd3dd] [&>button>span]:[border-radius:5px] [&>button>span]:[display:grid] [&>button>span]:[place-items:center] [&>button.active>span]:[color:white] [&>button.active>span]:[border-color:#5997dd] [&>button.active>span]:[background:#5997dd] [&_svg]:[width:11px] [display:grid] [grid-template-columns:repeat(3,1fr)] [gap:8px] [margin:16px_0_24px] [&>button]:[min-height:55px] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[gap:9px] [&>button]:[border:1px_solid_#e0e2e9] [&>button]:[border-radius:9px] [&>button]:[background:white] [&>button]:[padding:10px] [&>button.active]:[border-color:#6ba4e5] [&>button.active]:[background:#f4f9ff] [&_strong]:[font-size:11px]">
                {[
                  "Overview",
                  "My roster",
                  "Participants",
                  "People",
                  "Finance & claims",
                ].map((item) => (
                  <button
                    className={role.home === item ? "active" : ""}
                    onClick={() =>
                      setRoles((current) =>
                        current.map((r) =>
                          r.id === role.id ? { ...r, home: item } : r,
                        ),
                      )
                    }
                    key={item}
                  >
                    <span>{role.home === item && <Check />}</span>
                    <strong>{item}</strong>
                  </button>
                ))}
              </div>
              <section>
                <h3>Login controls</h3>
                {[
                  "Require multi-factor authentication",
                  "Allow mobile application access",
                  "Require device re-verification every 30 days",
                  "End inactive sessions after 30 minutes",
                ].map((item, index) => (
                  <label key={item}>
                    <input type="checkbox" defaultChecked={index !== 2} />
                    {item}
                  </label>
                ))}
              </section>
            </div>
          )}
          {tab === "Assigned people" && (
            <div className="assigned-users [flex:1] [&>.role-section-title_.primary-button_svg]:[width:14px] [&>div:not(.role-section-title)]:[display:grid] [&>div:not(.role-section-title)]:[grid-template-columns:35px_1fr_auto_25px] [&>div:not(.role-section-title)]:[align-items:center] [&>div:not(.role-section-title)]:[gap:9px] [&>div:not(.role-section-title)]:[border-top:1px_solid_#dddfd7] [&>div:not(.role-section-title)]:[padding:12px_2px] [&>div:not(.role-section-title)>span]:[width:34px] [&>div:not(.role-section-title)>span]:[height:34px] [&>div:not(.role-section-title)>span]:[border-radius:50%] [&>div:not(.role-section-title)>span]:[display:grid] [&>div:not(.role-section-title)>span]:[place-items:center] [&>div:not(.role-section-title)>span]:[background:#e9f3ff] [&>div:not(.role-section-title)>span]:[color:#508acc] [&>div:not(.role-section-title)>span]:[font-size:11px] [&>div:not(.role-section-title)>span]:[font-weight:800] [&_strong]:[display:block] [&_strong]:[font-size:11px] [&_small]:[display:block] [&_small]:[font-size:11px] [&_small]:[color:#72756d] [&_small]:[margin-top:2px] [&_em]:[padding:4px_7px] [&_em]:[border-radius:9px] [&_em]:[background:#e2f7ed] [&_em]:[color:#187455] [&_em]:[font-size:11px] [&_em]:[font-style:normal] [&_em.invited]:[background:#fff0d8] [&_em.invited]:[color:#93671f] [&>div>button]:[border:0] [&>div>button]:[background:none]">
              <div className="role-section-title [display:flex] [justify-content:space-between] [align-items:center] [margin-bottom:15px] [&_h3]:[margin:0] [&_h3]:[font-size:14px] [&_p]:[margin:4px_0_0] [&_p]:[color:#858c9b] [&_p]:[font-size:11px] [&>span]:[padding:5px_8px] [&>span]:[border-radius:8px] [&>span]:[background:#dddfd7] [&>span]:[color:#6f7585] [&>span]:[font-size:11px]">
                <div>
                  <h3>People with this role</h3>
                  <p>Access invitations and current account status.</p>
                </div>
                <button
                  className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] "
                  onClick={() => notify("Invitation workflow opened.")}
                >
                  <Send />
                  Invite person
                </button>
              </div>
              {[
                "Olivia Williams",
                "Maya Singh",
                "Zoe King",
                "Daniel Wu",
                "Grace Martin",
              ]
                .slice(0, Math.max(2, Math.min(5, role.users)))
                .map((name, index) => (
                  <div key={name}>
                    <span>
                      {name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")}
                    </span>
                    <div>
                      <strong>{name}</strong>
                      <small>
                        {name.toLowerCase().replace(" ", ".")}
                        @harbourcare.com.au
                      </small>
                    </div>
                    <em className={index === 1 ? "invited" : "active"}>
                      {index === 1 ? "Invitation sent" : "Active"}
                    </em>
                    <button>
                      <MoreHorizontal />
                    </button>
                  </div>
                ))}
            </div>
          )}
          {tab === "Audit history" && (
            <div className="role-audit [padding:22px] [flex:1] [&_h3]:[margin:0] [&_h3]:[font-size:14px] [&>div]:[display:grid] [&>div]:[grid-template-columns:27px_1fr_auto] [&>div]:[gap:9px] [&>div]:[padding:12px_0] [&>div]:[border-top:1px_solid_#e7e8ed] [&>div>span]:[width:25px] [&>div>span]:[height:25px] [&>div>span]:[border-radius:7px] [&>div>span]:[display:grid] [&>div>span]:[place-items:center] [&>div>span]:[color:#258064] [&>div>span]:[background:#e6f7f0] [&_svg]:[width:13px] [&_strong]:[font-size:11px] [&_p]:[font-size:11px] [&_time]:[font-size:11px] [&_p]:[margin:3px_0] [&_p]:[color:#72756d] [&_time]:[color:#969cab]">
              <h3>Recent access changes</h3>
              {[
                [
                  "Screen permission updated",
                  "Participants enabled by Olivia Williams",
                  "Today, 10:42 am",
                ],
                [
                  "Role assigned",
                  "Maya Singh assigned Service manager",
                  "Yesterday, 3:18 pm",
                ],
                [
                  "Login home changed",
                  "Start screen changed to Today’s roster",
                  "29 Jul, 11:06 am",
                ],
              ].map((item) => (
                <div key={item[0]}>
                  <span>
                    <Check />
                  </span>
                  <div>
                    <strong>{item[0]}</strong>
                    <p>{item[1]}</p>
                  </div>
                  <time>{item[2]}</time>
                </div>
              ))}
            </div>
          )}
          <footer>
            <span>
              <ShieldCheck />
              Changes are recorded in the organisation audit log.
            </span>
            <button
              className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] "
              onClick={() => notify("Role permissions saved.")}
            >
              Save role
            </button>
          </footer>
        </main>
      </div>
      {createOpen && (
        <CreateRoleModal
          roles={roles}
          onClose={() => setCreateOpen(false)}
          onCreate={(name, sourceId) => {
            const source = roles.find((item) => item.id === sourceId)!;
            const id = `custom-${Date.now()}`;
            setRoles((current) => [
              ...current,
              {
                id,
                name,
                description: `Custom role based on ${source.name}.`,
                users: 0,
                colour: "blue",
                home: source.home,
              },
            ]);
            setPermissions((current) => ({
              ...current,
              [id]: [...(current[sourceId] || [])],
            }));
            setSelectedId(id);
            setCreateOpen(false);
            notify(
              `${name} created. Review its access before assigning people.`,
            );
          }}
        />
      )}
      {toast && (
        <div className="access-toast [position:fixed] [right:24px] [bottom:24px] [z-index:120] [padding:11px_15px] [border-radius:9px] [color:#fff] [background:#252f3d] [display:flex] [align-items:center] [gap:7px] [font-size:11px] [&_svg]:[width:14px] [&_svg]:[color:#7fd7b3]">
          <Check />
          {toast}
        </div>
      )}
    </section>
  );
}
