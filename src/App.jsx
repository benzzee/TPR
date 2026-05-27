import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Schedule } from './pages/Schedule';
import { Attendance } from './pages/Attendance';
import { LessonPlans } from './pages/LessonPlans';
import { Activities } from './pages/Activities';
import { Portfolio } from './pages/Portfolio';
import { Creators } from './pages/Creators';
import { Record } from './pages/Record';
import { Placeholder } from './pages/Placeholder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="lesson-plans" element={<LessonPlans />} />
          <Route path="activities" element={<Activities />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="evaluation" element={<Placeholder title="แบบการประเมินฝึกสอน" />} />
          <Route path="record" element={<Record />} />
          <Route path="research" element={<Placeholder title="วิจัยในชั้นเรียน" />} />
          <Route path="creators" element={<Creators />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
