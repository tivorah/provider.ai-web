import { Copy, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { AccessRoleContent } from "../../../utils/content";

export function CreateRoleModal({
  roles,
  onClose,
  onCreate,
}: {
  roles: AccessRoleContent[];
  onClose: () => void;
  onCreate: (name: string, sourceId: string) => void;
}) {
  const [name, setName] = useState("");
  const [sourceId, setSourceId] = useState("manager");
  return (
    <div className="access-modal-backdrop [position:fixed] [inset:0] [z-index:100] [display:grid] [place-items:center] [&>section]:[position:relative] [&>section]:[width:min(440px,calc(100%_-_30px))] [&>section]:[padding:25px] [&>section]:[border-radius:14px] [&>section]:[background:#fff] [&>section>button:first-child]:[position:absolute] [&>section>button:first-child]:[right:12px] [&>section>button:first-child]:[top:12px] [&>section>button:first-child]:[border:0] [&>section>button:first-child]:[background:#f1f2f5] [&>section>button:first-child]:[border-radius:7px] [&>section>span]:[width:39px] [&>section>span]:[height:39px] [&>section>span]:[display:grid] [&>section>span]:[place-items:center] [&>section>span]:[border-radius:9px] [&>section>span]:[color:#386590] [&>section>span]:[background:#f0f5fa] [&_h2]:[font-size:19px] [&_h2]:[margin:12px_0_4px] [&_p]:[color:#858c9b] [&_p]:[font-size:11px] [&_label]:[display:grid] [&_label]:[gap:5px] [&_label]:[font-size:11px] [&_label]:[font-weight:700] [&_label]:[margin:12px_0] [&_input]:[padding:10px] [&_input]:[border:1px_solid_#dfe1e8] [&_input]:[border-radius:8px] [&_select]:[padding:10px] [&_select]:[border:1px_solid_#dfe1e8] [&_select]:[border-radius:8px] [&_.primary-button]:[width:100%] [&_.primary-button]:[justify-content:center] [&_.primary-button]:[margin-top:15px]">
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          onCreate(name.trim(), sourceId);
        }}
      >
        <button type="button" onClick={onClose}>
          <X />
        </button>
        <span>
          <Copy />
        </span>
        <h2>Create a business role</h2>
        <p>
          Start from an existing role, then tailor its screens and record scope.
        </p>
        <label>
          Role name
          <input
            required
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Roster coordinator"
          />
        </label>
        <label>
          Start with access from
          <select
            value={sourceId}
            onChange={(event) => setSourceId(event.target.value)}
          >
            {roles.map((role) => (
              <option value={role.id} key={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </label>
        <button className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] ">
          Create role
        </button>
      </form>
    </div>
  );
}
