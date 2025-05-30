import React, { useEffect, useRef, useState } from 'react'
import readExcelFromUrl from '../lib/fetchExcel';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import defaultConfig from './defaultConfig';
export default function Config() {
  const navigate = useNavigate();
  const once = useRef(false);

  const [currentConfig, setCurrentConfig] = useState(defaultConfig());
  const [data, setData] = useOutletContext();
  const [selectedClass, setSelectedClass] = useState({ semester: '', section: '' });
  const [section, setSection] = useState(null);


  function refreshFull() {
    if (typeof window.Android !== "undefined" && typeof window.Android.reloadWebView === "function") {
      window.Android.reloadWebView();
    }
    else {
      window.location.href=window.location.origin+window.location.pathname;
      //location.reload();
    }
  }
  useEffect(() => {
    if (once.current) return;
    once.current = true;
    //getting config from localstorage
    let config = localStorage.getItem("config");
    if (!config) {

      localStorage.setItem("config", JSON.stringify(defaultConfig()))
      navigate(0);
    }
    else {
      setCurrentConfig(JSON.parse(config));
    }

    //getting class from localstorage
    let class_ = localStorage.getItem("class");
    if (class_) {
      setSelectedClass(JSON.parse(class_));

    }



  }, [])

  useEffect(() => {
    if (data) sectionGenerator();
  }, [selectedClass, data])


  function saveConfig() {
    const temp =
    {
      "url": document.querySelector("[name='url']").value,
      "timeRow": parseInt(document.querySelector("[name='timeRow']").value),
      "timeColumn": parseInt(document.querySelector("[name='timeColumn']").value),
      "sectionColumn": parseInt(document.querySelector("[name='sectionColumn']").value),
      "semesterColumn": parseInt(document.querySelector("[name='semesterColumn']").value),
    }
    localStorage.setItem("config", JSON.stringify(temp));
    toast.success("Configuration saved!", {
      autoClose: 1000,
      onClose: () => { refreshFull()  }
    });
  }

  function saveDefault() {
    localStorage.setItem("config", JSON.stringify(defaultConfig()));
    toast.success("Configuration restored to default", {
      autoClose: 1000,
      onClose: () => { refreshFull()  }
    });

  }

  function sectionGenerator() {

    const semesterr = document.querySelector("[name='semester']").value;
    if (semesterr != "...") setSection(Object.keys(data.data[0][semesterr]));

  }

  function saveClass() {
    const temp = { semester: document.querySelector("[name='semester']").value, section: document.querySelector("[name='section']").value };
    localStorage.setItem("class", JSON.stringify(temp));
    refreshFull();
  }
  function clearStorage() {

    localStorage.clear();
    toast.success("Configuration cleared.", {
      autoClose: 500,
      onClose: () => { refreshFull()  }
    });
  }

  return (
    <>
      {/*Design:  https://play.tailwindcss.com/14BHbypVbt */}
      <div class="my-1 flex  rounded-xl bg-teal-800 p-0 text-center text-white "><a className='p-2 w-full underline text-center' href="https://t.me/sheet_routine">Join Telegram Channel for offline app, updates, bug report</a></div>

      <div className="mt-5 rounded-t-xl bg-teal-800 p-4 text-center text-white">Choose Your Class</div>
      <div className="bg-teal-500 p-4">
        <label
        >Semester:

          <select onChange={() => sectionGenerator()} name="semester" className="w-full bg-teal-400 p-2">

            {data && <option value="...">Select Semester</option>}
            {data ? Object.keys(data.data[0]).map((value, key) => <>
              <option key={key} selected={value === selectedClass.semester} value={value}>{value}</option>
            </>) : <option value="...">Loading...</option>}
          </select>
        </label>

        <label
        >Section:

          <select className="w-full bg-teal-400 p-2" name='section'>
            {section && section.map((value, key) => <>
              <option key={key} selected={value === selectedClass.section} value={value}>{value}</option>
            </>)}
          </select>
        </label>

        <div className="mt-4 flex justify-center gap-2"><button className="rounded-xl bg-green-300 px-3 py-1" onClick={() => saveClass()}>💾 Save</button></div>
      </div>

      <div className="mt-5 rounded-t-xl bg-teal-800 p-4 text-center text-white">Google Sheet Config</div>
      <div className="bg-teal-500 p-4">
        <label
        >Sheet URL:
          <textarea className="w-full bg-teal-400 p-2" onChange={(e) => setCurrentConfig(p => { return { ...p, url: e.target.value } })} value={currentConfig.url} name='url'></textarea>
        </label>

        <label
        >Time Row:
          <input type="number" className="w-full bg-teal-400 p-2" onChange={(e) => setCurrentConfig(p => { return { ...p, timeRow: e.target.value } })} value={currentConfig.timeRow} name='timeRow' />
        </label>

        <label
        >Time Column:
          <input type="number" className="w-full bg-teal-400 p-2" onChange={(e) => setCurrentConfig(p => { return { ...p, timeColumn: e.target.value } })} value={currentConfig.timeColumn} name='timeColumn' />
        </label>

        <label
        >Section Column:
          <input type="number" className="w-full bg-teal-400 p-2" onChange={(e) => setCurrentConfig(p => { return { ...p, sectionColumn: e.target.value } })} value={currentConfig.sectionColumn} name='sectionColumn' />
        </label>

        <label
        >Semester Column:
          <input type="number" className="w-full bg-teal-400 p-2" onChange={() => { }} value={currentConfig.semesterColumn} name='semesterColumn' />
        </label>

        <div className="mt-4 flex justify-center gap-2"><button className="rounded-xl bg-green-300 px-3 py-1" onClick={() => saveConfig()}>💾 Save</button> <button className="rounded-xl bg-green-300 px-3 py-1" onClick={() => saveDefault()}>↩️ Default</button></div>
      </div>
      <div class="my-1 flex  rounded-xl bg-teal-800 p-0 text-center text-black flex justify-center "><button className="rounded-xl bg-green-300 px-3 py-1" onClick={() => clearStorage()}>❌ Clear Memory</button></div>


    </>
  )
}
