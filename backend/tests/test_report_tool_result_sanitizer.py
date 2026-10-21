from types import SimpleNamespace

import pytest

from app.services.report_agent import ReportAgent


@pytest.mark.parametrize(
    ("response", "expected"),
    [
        ("before <tool_result>fake</tool_result> after", "before  after"),
        ("before\n<tool_result>line 1\nline 2</tool_result>\nafter", "before\n\nafter"),
        ("a<TOOL_RESULT source='model'>fake</TOOL_RESULT>b", "ab"),
        (
            "a<tool_result>outer<tool_result>inner</tool_result>end</tool_result>b",
            "ab",
        ),
        ("safe<tool_result>unclosed fake", "safe"),
        ("safe<tool_result malformed", "safe"),
        ("a</tool_result>b", "ab"),
    ],
)
def test_strip_fake_tool_results(response, expected):
    assert ReportAgent._strip_fake_tool_results(response) == expected


def test_preserves_legitimate_text_without_tool_result_tags():
    response = "Final Answer: <tool_call>{}</tool_call> legitimate text"

    assert ReportAgent._strip_fake_tool_results(response) == response


def test_plan_outline_uses_sample_facts_placeholder(monkeypatch):
    agent = object.__new__(ReportAgent)
    agent.graph_id = "graph_123"
    agent.simulation_id = "sim_123"
    agent.simulation_requirement = "Forecast future public sentiment"
    agent.zep_tools = SimpleNamespace(
        get_simulation_context=lambda **kwargs: {
            "graph_statistics": {
                "total_nodes": 5,
                "total_edges": 7,
                "entity_types": {"person": 2, "org": 3},
            },
            "related_facts": [{"text": "fact 1"}, {"text": "fact 2"}],
        },
        total_entities=4,
    )

    class DummyLLM:
        def chat_json(self, messages, temperature=0.3):
            return {
                "title": "Forecast Report",
                "summary": "Summary",
                "sections": [{"title": "Section 1"}, {"title": "Section 2"}],
            }

    agent.llm = DummyLLM()

    outline = agent.plan_outline()

    assert outline.title == "Forecast Report"
    assert [section.title for section in outline.sections] == ["Section 1", "Section 2"]
