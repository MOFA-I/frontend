import { Route, Routes } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Loading from "./pages/Loading";
import Result from "./pages/Result";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}
