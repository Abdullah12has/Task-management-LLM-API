import traceback
from uuid import UUID

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extentions.extensions import cache
from models import Team, TeamMembership, User, db
from schemas.schemas import TEAM_MEMBERSHIP_SCHEMA, TEAM_SCHEMA
from validators.validators import validate_json

# Blueprint for team-related routes
team_bp = Blueprint("team_routes", __name__)

# ------------------ ERROR HANDLERS ------------------


@team_bp.errorhandler(400)
def bad_request(error):
    """Handles 400 errors (Bad Request)."""
    return jsonify({"error": "Bad Request", "message": str(error)}), 400


@team_bp.errorhandler(404)
def not_found(error):
    """Handles 404 errors (Not Found)."""
    return jsonify({"error": "Not Found", "message": str(error)}), 404


@team_bp.errorhandler(500)
def internal_error(error):
    """Handles 500 errors (Internal Server Error)."""
    return jsonify({"error": "Internal Server Error", "message": str(error)}), 500


# ------------------ TEAM ROUTES ------------------


@team_bp.route("/teams", methods=["POST"])
@jwt_required()
@validate_json(TEAM_SCHEMA)
def create_team():
    """
    Creates a new team. Only authorized users can create a team.

    - **name**: The name of the team (required).
    - **description**: A description of the team (optional).
    - **lead_id**: The user ID of the team leader (required).

    Returns:
        - JSON representation of the newly created team.
        - HTTP Status Code: 201 (Created) on success.
        - HTTP Status Code: 500 (Internal Server Error) on failure.
    """
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"error": "User not authenticated"}), 401

        data = request.get_json()

        # Validate lead_id is a valid UUID and exists
        try:
            if not data.get("lead_id"):
                return jsonify({"error": "Lead ID is required"}), 400

            lead_id = UUID(data["lead_id"])
        except ValueError:
            return jsonify({"error": "Invalid lead_id format"}), 400

        # Check if lead exists
        lead = User.query.get(lead_id)
        if not lead:
            return jsonify({"error": "Invalid lead_id: User not found"}), 404

        # Create a new team object
        new_team = Team(name=data["name"], description=data.get("description"), lead_id=lead_id)

        # Add the team to the session and commit to the database
        db.session.add(new_team)
        db.session.commit()

        return jsonify(new_team.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@team_bp.route("/teams/<uuid:team_id>", methods=["GET"])
@jwt_required()
@cache.cached(timeout=60)  # Cache the response for 60 seconds
def get_team(team_id):
    """
    Retrieves details of a specific team by its ID.

    Args:
        - **team_id**: UUID of the team to retrieve.

    Returns:
        - JSON representation of the team if found.
        - HTTP Status Code: 200 (OK) on success.
        - HTTP Status Code: 404 (Not Found) if the team doesn't exist.
    """
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"error": "User not authenticated"}), 401

        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Team not found"}), 404
        return jsonify(team.to_dict()), 200

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@team_bp.route("/teams/<uuid:team_id>", methods=["PUT"])
@jwt_required()
@validate_json(TEAM_SCHEMA)
def update_team(team_id):
    """
    Updates an existing team's details.

    Args:
        - **team_id**: UUID of the team to update.

    Request Body:
        - **name**: The new name of the team (optional).
        - **description**: The new description of the team (optional).
        - **lead_id**: The new team leader's user ID (optional).

    Returns:
        - JSON representation of the updated team on success.
        - HTTP Status Code: 200 (OK).
        - HTTP Status Code: 404 (Not Found) if the team does not exist.
        - HTTP Status Code: 400 (Bad Request) if invalid data is provided.
    """
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"error": "User not authenticated"}), 401

        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Team not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        if "name" in data:
            team.name = data["name"]

        if "description" in data:
            team.description = data["description"]

        if "lead_id" in data:
            try:
                lead_id = UUID(data["lead_id"])
                # Verify lead exists
                lead = User.query.get(lead_id)
                if not lead:
                    return jsonify({"error": "Invalid lead_id: User not found"}), 404
                team.lead_id = lead_id
            except ValueError:
                return jsonify({"error": "Invalid lead_id format"}), 400

        db.session.commit()
        return jsonify(team.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@team_bp.route("/teams/<uuid:team_id>", methods=["DELETE"])
@jwt_required()
def delete_team(team_id):
    """
    Deletes a team by its ID.

    Args:
        - **team_id**: UUID of the team to delete.

    Returns:
        - Success message if team is deleted.
        - HTTP Status Code: 200 (OK) on success.
        - HTTP Status Code: 404 (Not Found) if the team does not exist.
    """
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"error": "User not authenticated"}), 401

        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Team not found"}), 404

        db.session.delete(team)
        db.session.commit()
        return jsonify({"message": "Team deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


# ------------------ TEAM MEMBERSHIP ROUTES ------------------


@team_bp.route("/teams/<uuid:team_id>/members", methods=["POST"])
@jwt_required()
@validate_json(TEAM_MEMBERSHIP_SCHEMA)
def add_team_member(team_id):
    """
    Adds a user to a team with a specified role.

    Args:
        - **team_id**: UUID of the team.
        - Request Body:
            - **user_id**: The user ID to add to the team (required).
            - **role**: The role the user will have in the team (required).

    Returns:
        - Success message if the user is added successfully.
        - HTTP Status Code: 201 (Created) on success.
        - HTTP Status Code: 400 (Bad Request) if the user is already a member of the team.
        - HTTP Status Code: 500 (Internal Server Error) on failure.
    """
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"error": "User not authenticated"}), 401

        # Check if team exists
        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Team not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        if "user_id" not in data or not data["user_id"]:
            return jsonify({"error": "User ID is required"}), 400

        if "role" not in data or not data["role"]:
            return jsonify({"error": "Role is required"}), 400

        try:
            user_id = UUID(data["user_id"])
        except ValueError:
            return jsonify({"error": "Invalid user_id format"}), 400

        # Verify user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if the user is already a member of the team
        existing_member = TeamMembership.query.filter_by(team_id=team_id, user_id=user_id).first()
        if existing_member:
            return jsonify({"error": "User is already a member of this team"}), 400

        membership = TeamMembership(user_id=user_id, team_id=team_id, role=data["role"])
        db.session.add(membership)
        db.session.commit()
        return jsonify({"message": "Member added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@team_bp.route("/teams/<uuid:team_id>/members/<uuid:user_id>", methods=["PUT"])
@jwt_required()
@validate_json({"type": "object", "properties": {"role": {"type": "string"}}, "required": ["role"]})
def update_team_member(team_id, user_id):
    """
    Updates the role of a member in a team.

    Args:
        - **team_id**: UUID of the team.
        - **user_id**: UUID of the user whose role will be updated.
        - Request Body:
            - **role**: The new role for the user (required).

    Returns:
        - Success message if the role is updated.
        - HTTP Status Code: 200 (OK).
        - HTTP Status Code: 404 (Not Found) if the membership does not exist.
    """
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"error": "User not authenticated"}), 401

        # Check if team exists
        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Team not found"}), 404

        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        membership = TeamMembership.query.filter_by(team_id=team_id, user_id=user_id).first()
        if not membership:
            return jsonify({"error": "Membership not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        if "role" not in data or not data["role"]:
            return jsonify({"error": "Role is required"}), 400

        membership.role = data["role"]
        db.session.commit()
        return jsonify({"message": "Member role updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@team_bp.route("/teams/<uuid:team_id>/members/<uuid:user_id>", methods=["DELETE"])
@jwt_required()
def remove_team_member(team_id, user_id):
    """
    Removes a user from a team.

    Args:
        - **team_id**: UUID of the team.
        - **user_id**: UUID of the user to be removed from the team.

    Returns:
        - Success message if the user is removed successfully.
        - HTTP Status Code: 200 (OK) on success.
        - HTTP Status Code: 404 (Not Found) if the membership does not exist.
    """
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"error": "User not authenticated"}), 401

        # Check if team exists
        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Team not found"}), 404

        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        membership = TeamMembership.query.filter_by(team_id=team_id, user_id=user_id).first()
        if not membership:
            return jsonify({"error": "Membership not found"}), 404

        db.session.delete(membership)
        db.session.commit()
        return jsonify({"message": "Member removed successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


@team_bp.route("/teams/<uuid:team_id>/members", methods=["GET"])
@jwt_required()
@cache.cached(timeout=60)  # Cache this endpoint for 60 seconds
def get_team_members(team_id):
    """
    Retrieves all members of a specific team.

    Args:
        - **team_id**: UUID of the team whose members are to be retrieved.

    Returns:
        - List of members of the team, including their user IDs and roles.
        - HTTP Status Code: 200 (OK) on success.
        - HTTP Status Code: 404 (Not Found) if the team does not exist.
    """
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"error": "User not authenticated"}), 401

        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Team not found"}), 404

        members = TeamMembership.query.filter_by(team_id=team_id).all()
        member_list = [
            {
                "user_id": str(member.user_id),
                "role": member.role,
                "_links": {"self": f"/users/{member.user_id}"},
            }
            for member in members
        ]
        return jsonify({"team_id": str(team_id), "members": member_list}), 200

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500
