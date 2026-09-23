import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/authApi";
import { SkeletonBlock } from "../components/common/Skeleton";

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    getProfile().then((p) => { setProfile(p); setForm(p); });
  }, []);

  async function handleSave() {
    const updated = await updateProfile(form);
    setProfile(updated);
    setEditing(false);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!profile) return <div className="max-w-[600px] mx-auto px-4 py-10"><SkeletonBlock className="h-80 w-full" /></div>;

  return (
    <div className="max-w-[600px] mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full object-cover" />
        <div>
          <h1 className="text-2xl">{profile.name}</h1>
          <p className="text-sm text-ink-soft">{profile.email}</p>
        </div>
      </div>

      <div className="bg-white border border-line rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Personal details</p>
          <button type="button" onClick={() => setEditing((v) => !v)} className="text-xs font-semibold text-coral-dark flex items-center gap-1">
            <Pencil size={12} /> {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-line text-sm outline-none" placeholder="Name" />
            <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-line text-sm outline-none" placeholder="Mobile" />
            <input value={form.budgetPreference} onChange={(e) => setForm({ ...form, budgetPreference: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-line text-sm outline-none" placeholder="Budget preference" />
            <button type="button" onClick={handleSave} className="w-full bg-coral text-white text-sm font-semibold py-2.5 rounded-full">Save changes</button>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-soft"><span>Mobile</span><span className="text-ink">{profile.mobile}</span></div>
            <div className="flex justify-between text-ink-soft"><span>Language</span><span className="text-ink">{profile.preferredLanguage}</span></div>
            <div className="flex justify-between text-ink-soft"><span>Budget preference</span><span className="text-ink">{profile.budgetPreference}</span></div>
          </div>
        )}
      </div>

      <div className="bg-white border border-line rounded-2xl p-5 mt-4">
        <p className="text-sm font-semibold mb-3">Travel preferences</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {profile.preferredTravelTypes.map((t) => (
            <span key={t} className="text-xs font-medium bg-sand-2 border border-line px-3 py-1.5 rounded-full">{t}</span>
          ))}
        </div>
        <p className="text-xs text-ink-muted">Favorite destinations: {profile.favoriteDestinations.join(", ")}</p>
      </div>

      <button type="button" onClick={handleLogout} className="w-full flex items-center justify-center gap-2 border border-line text-sm font-semibold py-3 rounded-full mt-6 text-coral-dark">
        <LogOut size={15} /> Log out
      </button>
    </div>
  );
}
