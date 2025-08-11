import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";

const Analytics = () => {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-2">
        <div className="overflow-hiddenpb-2">
          <Heading
            label="Analytics"
            className="text-xl font-semibold main-website-text-color"
          />
          <Paragraph
            label="Graphs and Technical Insights"
            className="text-base main-website-text-color"
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
