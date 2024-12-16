import { UserAuthContext } from "./schema";

export class UserAccess {
  user: UserAuthContext["user"];

  constructor(user: UserAuthContext["user"]) {
    this.user = user;
  }

  get workspace() {
    return {
      checkAccessBySlug: (slug: string) =>
        this.user.workspaceMemberships.some((wm) => wm.workspace.slug === slug),

      checkAccessById: (id: string) =>
        this.user.workspaceMemberships.some((wm) => wm.workspace.id === id),
    };
  }

  get teamspace() {
    return {
      ids: this.user.workspaceMemberships
        .map((m) => m.workspace.teamspaces.map((t) => t.id))
        .flat(),

      checkAccessBySlug: (tsSlug: string, wsSlug: string) =>
        this.workspace.checkAccessBySlug(wsSlug) &&
        this.user.workspaceMemberships.some((wm) =>
          wm.workspace.teamspaces.some((ts) => ts.slug === tsSlug),
        ),

      checkAccessById: (id: string) =>
        this.user.workspaceMemberships.some((wm) =>
          wm.workspace.teamspaces.some((ts) => ts.id === id),
        ),
    };
  }
}
