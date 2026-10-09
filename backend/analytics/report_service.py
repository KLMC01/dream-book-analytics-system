from pathlib import Path
from datetime import datetime
import tempfile
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from jinja2 import Template
from weasyprint import HTML, CSS

class ReportService:
    def build_pdf(self, result, *, filename, filters, chart_type):
        base = Path(__file__).resolve().parents[1]
        template = base / "templates/reports/analysis_report.html"
        css = base / "templates/reports/report_style.css"
        logo = base / "static/images/dream-book-shop-logo.png"

        chart = self.make_chart(result, chart_type)

        rows = result.get("table", [])
        headers = list(rows[0].keys()) if rows else []

        html = Template(template.read_text()).render(
            logo=str(logo),
            title=result.get("title","Analysis Report"),
            filename=filename,
            date=datetime.now().strftime("%d %B %Y"),
            summary=result.get("summary",[]),
            interpretation=result.get("interpretation",""),
            chart=chart,
            chart_type=chart_type,
            table=rows,
            headers=headers,
            recommendations=self.recommend(result.get("title",""))
        )

        pdf = HTML(string=html, base_url=str(base)).write_pdf(
            stylesheets=[CSS(filename=str(css))]
        )

        if chart:
            Path(chart).unlink(missing_ok=True)

        return pdf

    def make_chart(self,result,chart_type):
        labels=result.get("labels")
        datasets=result.get("datasets")
        if not labels or not datasets:
            return None

        f=tempfile.NamedTemporaryFile(delete=False,suffix=".png")
        f.close()

        values=datasets[0].get("data",[])
        fig,ax=plt.subplots(figsize=(8,3))

        chart = str(chart_type).lower()

        if chart in ["pie", "doughnut", "donut"]:
            wedges, texts, autotexts = ax.pie(
                values,
                labels=labels,
                autopct="%1.1f%%",
                startangle=90
            )

            centre_circle = plt.Circle(
                (0, 0),
                0.55,
                fc="white"
            )
            ax.add_artist(centre_circle)
            ax.axis("equal")

        elif chart == "line":
            ax.plot(
                labels,
                values,
                marker="o"
            )

        else:
            ax.bar(
                labels,
                values
            )

        fig.tight_layout()
        fig.savefig(f.name,dpi=180)
        plt.close(fig)
        return f.name

    def recommend(self,title):
        t=title.lower()
        if "isbn" in t:
            return ["Improve ISBN completeness.","Validate metadata quality."]
        if "author" in t:
            return ["Review author contribution.","Analyse author diversity."]
        if "publisher" in t:
            return ["Evaluate publisher performance.","Compare publishers."]
        return ["Review patterns.","Use insights for decisions."]
